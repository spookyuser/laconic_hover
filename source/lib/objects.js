import Constants from "./constants";
import { fetchElement } from "./api";

/** Class representing a Trope on tvtropes */
export class Trope {
  /** Creates an instance of a trope
   *
   * @param {String} url The url of the trope
   * @param {String} title The title of the trope
   * @param {String} laconic The laconic description of the trope
   */
  constructor(url, title, laconic) {
    this.url = url;
    this._title = title;
    this._laconic = laconic;
  }

  /** Fetches the trope title from its url
   *
   * @returns {string} The original title of the trope from the url
   */
  get title() {
    return fetchElement(this.url, Constants.TITLE);
  }

  /** Fetches the laconic description of a trope from its laconicUrl
   *
   * @returns {string} The laconic description of the trope
   */
  get laconic() {
    return fetchElement(this.laconicUrl(), Constants.LACONIC);
  }

  /** Generates a url for the laconic page of a trope from the main page
   *
   * @returns {string} A url to the trope's expected laconic page
   */
  laconicUrl() {
    // Regex to replace normal link with link directly to laconic page
    return this.url.replace(/(pmwiki\.php)\/.*\//g, "pmwiki.php/Laconic/");
  }

  /** Combines the title and laconic of a trope into a single object
   *
   * This also initiates the calls to laconic() and title() which in turn
   * start a fetch request or retrieve the objects from cache.
   *
   * @returns {String} An object made up of the title and laconic
   */
  async toString() {
    // From https://stackoverflow.com/a/41292710/1649917
    const { title, laconic } = { title: this.title, laconic: this.laconic };
    return {
      title: await title,
      laconic: await laconic,
    };
  }
}
