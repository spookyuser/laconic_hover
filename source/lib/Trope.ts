import { fetchPage } from "./api";

/** Class representing a Trope on tvtropes */
export class Trope {
  url: string;
  title: string;
  laconic: string;

  constructor(url: string) {
    this.url = url;
  }

  async getTrope(): Promise<Trope> {
    let document = await fetchPage(this.getLaconicUrl());

    const titleElement = document.querySelector(".entry-title");
    if (titleElement?.textContent) {
      this.title = titleElement.textContent;
    } else {
      throw new Error("No laconic title found");
    }

    const laconicElement = document.querySelector("#main-article > p");
    if (laconicElement?.textContent) {
      this.laconic = laconicElement.textContent;
    } else {
      throw new Error("No laconic description found");
    }

    return this;
  }

  // Regex to replace normal link with link directly to laconic page
  getLaconicUrl(): string {
    return this.url.replace(/(pmwiki\.php)\/.*\//g, "pmwiki.php/Laconic/");
  }
}
