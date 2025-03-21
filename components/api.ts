import { DARK_MODE_COOKIE, DEFAULT_CHARACTER_ENCODING } from "./config";
import { storage } from "wxt/storage";

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

export class Trope {
  tropePath: string;
  tropeUrl: URL;
  expectedLaconicUrl: URL;
  title: string | undefined;
  laconic: string | undefined;
  returnTo: string | undefined;
  storageKey: string;

  constructor(tipHref: string) {
    this.tropePath = tipHref;
    this.tropeUrl = new URL(tipHref, window.location.origin);
    this.expectedLaconicUrl = Trope.getLaconicUrl(this.tropeUrl);
    this.storageKey = this.tropePath;
  }

  private async getFromCache() {
    if (import.meta.env.MODE === "production") {
      return storage.getItem<Trope>(`local:${this.storageKey}`);
    }
  }

  private async setToCache() {
    if (import.meta.env.MODE === "production") {
      storage.setItem(`local:${this.storageKey}`, this);
    }
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
    this.returnTo = this.extractReturnTo(document);

    await this.setToCache();
  }

  private extractLaconic(document: Document) {
    const laconicElement = document.querySelector("#main-article > p");
    if (laconicElement?.textContent) {
      return laconicElement.textContent.trim();
    }
    throw new LaconicError("NO_LACONIC");
  }

  private extractReturnTo(document: Document) {
    const returnToElement = document.querySelector("#main-article > dl");
    if (returnToElement?.innerHTML) {
      return returnToElement.innerHTML;
    }
  }

  private extractTitle(document: Document) {
    const titleElement = document.querySelector(".entry-title");
    if (titleElement?.textContent) {
      return titleElement.textContent.trim();
    }
    throw new LaconicError("NO_TITLE");
  }

  static getLaconicUrl(url: URL) {
    const laconicUrl = new URL(url.toString());
    laconicUrl.pathname = url.pathname.replace(
      /(pmwiki\.php)\/.*\//g,
      "pmwiki.php/Laconic/"
    );
    console.log(laconicUrl.toString());
    return laconicUrl;
  }

  private async fetchAndProcessUrl(
    url: URL,
    isLaconic: boolean,
    redirectAttempt = 0
  ): Promise<Document> {
    if (redirectAttempt > 2) {
      const tropeResponse = await fetch(this.tropeUrl, { redirect: "follow" });
      const doc = await decodeResponse(tropeResponse);
      this.title = this.extractTitle(doc);
      throw new LaconicError("NO_LACONIC", "Too many redirects");
    }

    const response = await fetch(url, { redirect: "follow" });

    if (response.status === 200) {
      return await decodeResponse(response);
    }

    // If 404 and this is a laconic URL, try the original URL
    if (response.status === 404 && isLaconic) {
      const originalUrl = isLaconic ? this.tropeUrl : url;
      const tropeResponse = await fetch(originalUrl, { redirect: "follow" });

      // If URL didn't change, it's a true 404
      if (tropeResponse.url === originalUrl.href) {
        const doc = await decodeResponse(tropeResponse);
        this.title = this.extractTitle(doc);
        throw new LaconicError(
          "NO_LACONIC",
          `Laconic page not found: ${response.status} ${response.statusText}`
        );
      }

      // URL changed (redirected), try the laconic of the redirected URL
      const redirectedLaconicUrl = Trope.getLaconicUrl(
        new URL(tropeResponse.url)
      );
      return this.fetchAndProcessUrl(
        redirectedLaconicUrl,
        true,
        redirectAttempt + 1
      );
    }

    // Handle other error cases
    throw new LaconicError(
      "FETCHING_FAILED",
      `Fetching failed: ${response.status} ${response.statusText}`
    );
  }

  private async getLaconicDocument(): Promise<Document> {
    return this.fetchAndProcessUrl(this.expectedLaconicUrl, true);
  }
}

/*********************** weird utils **********************/

async function decodeResponse(response: Response) {
  const decoded = decodeBuffer(
    await response.arrayBuffer(),
    getCharset(response.headers)
  );
  const parser = new DOMParser();
  return parser.parseFromString(decoded, "text/html");
}

function getCharset(headers: Headers) {
  const charset = headers
    .get("Content-Type")
    ?.split(";")
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
  charset: string | undefined
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
