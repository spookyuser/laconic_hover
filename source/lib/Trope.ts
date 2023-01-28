import { fetchPage } from "./api";

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
    const stored = localStorage.getItem(this.url);
    if (stored) {
      const parsed = JSON.parse(stored);
      this.title = parsed.title;
      this.laconic = parsed.laconic;
      return this;
    }

    let document = await fetchPage(this.getLaconicUrl());

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
    this.save();

    return this;
  }

  // Store the object as a JSON string in local storage
  save(): void {
    localStorage.setItem(this.url, JSON.stringify(this));
  }

  // Regex to replace normal link with link directly to laconic page
  getLaconicUrl(): string {
    return this.url.replace(/(pmwiki\.php)\/.*\//g, "pmwiki.php/Laconic/");
  }
}
