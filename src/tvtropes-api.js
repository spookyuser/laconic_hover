import Constants from "./lib/constants";

export class Trope {
  constructor(url, laconic, title) {
    this.url = url;
    this.laconic = laconic;
    this.title = title;
  }

  // Adding a method to the constructor
  async getTitle() {
    let title = await fetchQuerySelector(this.url, Constants.TITLE_SELECTOR);
    return title;
  }

  async getLaconic() {
    //  let
  }
}

function getLaconicUrl(url) {
  //Regex to replace normal link with link directly to laconic page
  return url.replace(/(pmwiki\.php)\/.*\//g, "pmwiki.php/Laconic/");
}

async function fetchQuerySelector(url, querySelector) {
  let response = await fetch(url);
  let html = await response.text();
  let parser = new DOMParser();
  let document = parser.parseFromString(html, "text/html");
  return document.querySelector(querySelector).innerHTML;
}
