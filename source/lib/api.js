import Constants from "./constants";
import { decodeBuffer, getCharset } from "./utils";

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
export async function fetchElement(url, element) {
  const html = async () => {
    let response;
    const cache = await caches.open(Constants.CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (typeof cachedResponse === "undefined") {
      response = await fetch(url);
      cache.add(url, response.clone());
    } else {
      response = cachedResponse;
    }

    return decodeBuffer(
      await response.arrayBuffer(),
      getCharset(response.headers)
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
