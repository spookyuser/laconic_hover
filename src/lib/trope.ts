import { fetchPage } from "./api";
import { Storage } from "@plasmohq/storage";

const storage = new Storage({
  area: "local",
});

/** Class representing a Trope on tvtropes */
export class Trope {
  url: string;
  title: string;
  laconic: string;

  constructor(url: string) {
    this.url = url;
  }

  async fetchLaconic(): Promise<Trope> {
    // Check if the trope is already in local storage
    const stored = await storage.get<Trope>(this.url);
    if (stored) {
      this.title = stored.title;
      this.laconic = stored.laconic;
      return this;
    }

    let document = await fetchPage(this.url);

    const titleElement = document.querySelector(".entry-title");
    if (titleElement?.textContent) {
      this.title = titleElement.textContent.trim();
    } else {
      throw new Error("No laconic title found");
    }
    const laconicElement = document.querySelector("#main-article > p");
    if (laconicElement?.textContent) {
      this.laconic = laconicElement.textContent.trim();
    } else {
      throw new Error("No laconic description found");
    }
    storage.set(this.url, this);
    return this;
  }
}
