import Constants from "./lib/constants";

class Trope {
  constructor(url, title, laconic) {
    this.url = url;
    this._title = title;
    this._laconic = laconic;
  }

  get title() {
    return fetchQuerySelector(this.url, Constants.TITLE_SELECTOR);
  }

  get laconic() {
    return fetchQuerySelector(this.laconicUrl(), Constants.LACONIC_SELECTOR);
  }

  laconicUrl() {
    //Regex to replace normal link with link directly to laconic page
    return this.url.replace(/(pmwiki\.php)\/.*\//g, "pmwiki.php/Laconic/");
  }

  async toString() {
    // From https://stackoverflow.com/a/41292710/1649917
    const title = this.title;
    const laconic = this.laconic;

    return {
      title: await title,
      laconic: await laconic
    };
  }
}

async function fetchQuerySelector(url, querySelector) {
  let response = await fetch(url);
  let html = await response.text();
  let parser = new DOMParser();
  let document = parser.parseFromString(html, "text/html");
  return document.querySelector(querySelector).textContent;
}

function darkModeEnabled() {
  if (
    document.cookie
      .split(";")
      .filter(item => item.includes(Constants.DARK_MODE_COOKIE)).length
  )
    return true;
  else return false;
}

function getTheme() {
  if (darkModeEnabled()) return Constants.DARK_THEME;
  else return Constants.LIGHT_THEME;
}

export { Trope, getTheme };
