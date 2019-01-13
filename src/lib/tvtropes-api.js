import Constants from "./constants";

class Trope {
  constructor(url, title, laconic) {
    this.url = url;
    this._title = title;
    this._laconic = laconic;
  }

  get title() {
    return fetchQuerySelector(
      this.url,
      Constants.TITLE_SELECTOR.querySelector,
      Constants.TITLE_SELECTOR.property
    );
  }

  get laconic() {
    return fetchQuerySelector(
      this.laconicUrl(),
      Constants.LACONIC_SELECTOR.querySelector,
      Constants.LACONIC_SELECTOR.property
    );
  }

  laconicUrl() {
    // Regex to replace normal link with link directly to laconic page
    return this.url.replace(/(pmwiki\.php)\/.*\//g, "pmwiki.php/Laconic/");
  }

  async toString() {
    // From https://stackoverflow.com/a/41292710/1649917
    const { title, laconic } = { title: this.title, laconic: this.laconic };

    return {
      title: await title,
      laconic: await laconic
    };
  }
}

async function fetchQuerySelector(url, querySelector, property) {
  // Search the cache for the selected url, if it exists return cache
  // else get the page and save it to the cache
  // See-Also: https://developer.mozilla.org/en-US/docs/Web/API/Cache
  const html = async () => {
    let response;
    const cache = await caches.open(Constants.CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (typeof cachedResponse === "undefined") {
      response = await fetch(url);
      cache.put(url, response.clone());
    } else response = cachedResponse;
    let buffer = response.arrayBuffer();
    let text = decodeBuffer(await buffer);
    return text;
  };

  // Find the selected query selector and property, else return not found message
  const parser = new DOMParser();
  const document = parser.parseFromString(await html(), "text/html");
  const result = document.querySelector(querySelector)[property];

  // Check if the result includes a specific error string
  // if it does return the no laconic message
  // if it doesn't return the actual result
  // if nothing is found return the no laconic message
  return result.includes(Constants.NO_LACONIC_ERROR)
    ? Constants.NO_LACONIC
    : result || Constants.NO_LACONIC;
}

function darkModeEnabled() {
  if (
    document.cookie
      .split(";")
      .filter(item => item.includes(Constants.DARK_MODE_COOKIE)).length > 0
  )
    return true;
  return false;
}

function decodeBuffer(buffer) {
  // From https://schneide.blog/2018/08/08/decoding-non-utf8-server-responses-using-the-fetch-api/
  console.log("decoding");
  let decoder = new TextDecoder("iso-8859-1");
  let text = decoder.decode(buffer);
  return text;
}

export { Trope, darkModeEnabled };
