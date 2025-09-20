import { storage } from "wxt/storage";

type LaconicErrors = "NO_TITLE" | "NO_LACONIC" | "FETCHING_FAILED" | "404";

export class LaconicError extends Error {
  category: LaconicErrors;
  constructor(error: LaconicErrors, message?: string) {
    super(error);
    this.category = error;
    // @ts-expect-error
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
    return storage.getItem<Trope>(`local:${this.storageKey}-v1`);
  }

  private async setToCache() {
    storage.setItem(`local:${this.storageKey}-v1`, this);
  }

  /* Fetches a statically calculated url of where the laconic should be */
  async fetchLaconic() {
    const stored = await this.getFromCache();
    if (stored) {
      Object.assign(this, stored);
      const showStinger = await storage.getItem<boolean>("local:showStinger");
      if (showStinger === false) {
        this.returnTo = undefined;
      }

      return this;
    }

    const document = await this.getLaconicDocument();

    this.title = this.extractTitle(document);
    this.laconic = this.extractLaconic(document);
    this.returnTo = await this.extractReturnTo(document);

    await this.setToCache();
  }

  private extractLaconic(document: Document) {
    const laconicElement = document.querySelector("#main-article > p");
    if (laconicElement?.textContent) {
      return laconicElement.textContent.trim();
    }
    throw new LaconicError("NO_LACONIC");
  }

  private async extractReturnTo(document: Document) {
    const showStinger = await storage.getItem<boolean>("local:showStinger");
    if (showStinger === false) return undefined;

    const returnToElement = document.querySelector("#main-article > dl");
    if (returnToElement?.innerHTML) {
      return returnToElement.innerHTML;
    }
  }

  private extractTitle(document: Document) {
    const titleElement = document.querySelector(
      ".wrap-entry-breadcrumb strong"
    );
    const text = titleElement
      ? Array.prototype.filter
          .call(
            titleElement?.childNodes,
            (child) => child.nodeType === Node.TEXT_NODE
          )
          .map((child) => child.textContent)
          .join("")
      : null;
    if (text) {
      return text.trim();
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
  return charset ? charset.split("=")[1] : "iso-8859-1";
}

/** Manually decode an ArrayBuffer with a specific charset
 *
 * This is instead of using response.text() which only returns
 * utf-8. Since tvtropes isn't utf-8 we manually decode the
 * response.ArrayBuffer()
 *
 * From schneide.blog
 @see https://schneide.blog/2018/08/08/decoding-non-utf8-server-responses-using-the-fetch-api/
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
