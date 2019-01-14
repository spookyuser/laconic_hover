import Constants from "./constants";
import { decodeBuffer, getCharacterEncoding } from "./utils";

/** Class representing a Trope on tvtropes */
class Trope {
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
      laconic: await laconic
    };
  }
}

/** Fetches the content of a specific html element at a url
 *
 * Search the cache for the selected url, if it exists return cache
 * else get the page and save it to the cache
 * Importantly when parsing the fetch Response object, we don't use
 * the .text() function as this is encodes the html in UTF-8 even
 * though this is not always the case. So, instead we now use
 * .arrayBuffer() and then manually encode the text
 *
 * @see decodeBuffer
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 *
 * @param {String} url The url to fetch the element from
 * @param {Object} element The element made up of a querySelector and property
 */
async function fetchElement(url, element) {
  const html = async () => {
    let response;
    const cache = await caches.open(Constants.CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (typeof cachedResponse === "undefined") {
      response = await fetch(url);
      cache.put(url, response.clone());
    } else response = cachedResponse;

    return decodeBuffer(
      await response.arrayBuffer(),
      getCharacterEncoding(response.headers)
    );
  };

  // Find the selected query selector and property, else return not found message
  const parser = new DOMParser();
  const document = parser.parseFromString(await html(), "text/html");
  const result = document.querySelector(element.querySelector)[
    element.property
  ];

  // Check if the result includes a specific error string
  // if it does return the no laconic message
  // if it doesn't return the actual result
  // if nothing is found return the no laconic message
  return result.includes(Constants.NO_LACONIC_ERROR)
    ? Constants.NO_LACONIC
    : result || Constants.NO_LACONIC;
}

export { Trope };
