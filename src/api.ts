import { DARK_MODE_COOKIE, DEFAULT_CHARACTER_ENCODING } from "./config";
import { Storage } from "@plasmohq/storage";

type LaconicErrors = "NO_TITLE" | "NO_LACONIC" | "FETCHING_FAILED" | "404";

export class LaconicError extends Error {
  category: LaconicErrors;
  constructor(error: LaconicErrors, message?: string) {
    super(error);
    this.category = error;
    this.message = message;
  }
  // Default messages
  static messages = {
    NO_TITLE: "No title found",
    NO_LACONIC: "No laconic page found",
    FETCHING_FAILED: "Fetching failed",
  };
}

const storage = new Storage({
  area: "local",
});

export class Trope {
  tropePath: string;
  tropeUrl: URL;
  expectedLaconicUrl: URL;
  title: string;
  laconic: string;
  storageKey: string;

  constructor(tipHref: string) {
    this.tropePath = tipHref;
    this.tropeUrl = new URL(tipHref, window.location.origin);
    this.expectedLaconicUrl = Trope.getLaconicUrl(this.tropeUrl);
    this.storageKey = this.tropePath;
  }

  private async getFromCache() {
    return storage.get<Trope>(this.storageKey);
  }

  private async setToCache() {
    storage.set(this.storageKey, this);
  }

  /* Fetches a statically calculated url of there the laconic should be */
  async fetchLaconic() {
    // Check if the trope is already in local storage
    const stored = await this.getFromCache();
    if (stored) {
      this.title = stored.title;
      this.laconic = stored.laconic;
      return this;
    }

    const document = await this.getLaconicDocument();

    this.title = this.extractTitle(document);
    this.laconic = this.extractLaconic(document);
    await this.setToCache();
  }

  private extractLaconic(document: Document) {
    const laconicElement = document.querySelector("#main-article > p");
    if (laconicElement?.textContent) {
      return laconicElement.textContent.trim();
    } else {
      throw new LaconicError("NO_LACONIC");
    }
  }

  private extractTitle(document: Document) {
    const titleElement = document.querySelector(".entry-title");
    if (titleElement?.textContent) {
      return titleElement.textContent.trim();
    } else {
      throw new LaconicError("NO_TITLE");
    }
  }

  static getLaconicUrl(url: URL) {
    let laconicUrl = new URL(url.toString());
    laconicUrl.pathname = url.pathname.replace(
      /(pmwiki\.php)\/.*\//g,
      "pmwiki.php/Laconic/",
    );
    return laconicUrl;
  }

  private async getLaconicDocument() {
    try {
      return await fetchAndDecode(this.expectedLaconicUrl);
    } catch (error) {
      if (error instanceof LaconicError && error.category === "404") {
        return await this.handle404();
      } else {
        console.error(error);
        throw error;
      }
    }
  }

  /** We're using a static url in getLaconicUrl(), if it fails we need to check if the url was just guessed wrong, (99% of the time it isn't) but there are edge cases where it is, idk why.
   @see https://github.com/spookyuser/laconic_hover/issues/34
   @see getLaconicUrl()
   */
  private async handle404() {
    const response = await fetchURL(this.tropeUrl); // 1. Get response of base Trope page

    // 2. If the trope url is the same as the one we guessed, we know for sure the laconic doesn't exist
    if (response.url === this.tropeUrl.href) {
      let document = await decodeResponse(response);
      this.title = this.extractTitle(document);
      throw new LaconicError(
        "NO_LACONIC",
        `Fetching failed: ${response.status} ${response.statusText}`,
      );
    }

    // 3. But if the url is different, we know that the laconic page exists, but we just guessed the wrong url So we fetch the laconic page from the redirected url
    return await fetchAndDecode(new URL(response.url));
  }
}

/** Fetches a page from a URL and returns a DOMParser object  */
async function fetchURL(url: URL) {
  const response = await fetch(url.toString(), { redirect: "follow" });

  if (response.status === 404) {
    throw new LaconicError("404");
  }

  if (!response.ok) {
    throw new LaconicError("FETCHING_FAILED");
  }

  return response;
}

/* Explicityly decode according to the charset of the response, why do we need this? IDK but it doesn't work without it */
async function fetchAndDecode(url: URL) {
  const response = await fetchURL(url);
  const document = await decodeResponse(response);
  return document;
}

async function decodeResponse(response: Response) {
  const decoded = decodeBuffer(
    await response.arrayBuffer(),
    getCharset(response.headers),
  );
  const parser = new DOMParser();
  return parser.parseFromString(decoded, "text/html");
}

/*********************** weird utils ***************/

function getCharset(headers: Headers) {
  const charset = headers
    .get("Content-Type")!
    .split(";")
    .find((header: string | string[]) => header.includes("charset"));
  return charset ? charset.split("=")[1] : DEFAULT_CHARACTER_ENCODING;
}

/** Manually decode an ArrayBuffer with a specific charset
 *
 * This is instead of using response.text() which only returns
 * utf-8. Since tvtropes isn't utf-8 we manually decode the
 * response.ArrayBuffer() here
 *
 * From schneide.blog
 * @see https://schneide.blog/2018/08/08/decoding-non-utf8-server-responses-using-the-fetch-api/
 */
function decodeBuffer(
  buffer: BufferSource | undefined,
  charset: string | undefined,
) {
  const tryDecode = () => {
    try {
      return new TextDecoder(charset);
    } catch (error) {
      return new TextDecoder("UTF-8");
    }
  };
  const decoder = tryDecode();
  return decoder.decode(buffer);
}

export function darkModeEnabled(): boolean {
  return (
    document.cookie.split(";").filter((item) => item.includes(DARK_MODE_COOKIE))
      .length > 0
  );
}
