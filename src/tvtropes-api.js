export class Trope {
  constructor(url, laconic, title) {
    this.url = url;
    this.laconic = laconic;
    this.title = title;
  }

  // Adding a method to the constructor
  async getTitle() {
    let response = await fetch(this.url);
    let html = await response.text();
    let parser = new DOMParser();
    let document = parser.parseFromString(html, "text/html");
    let title = document.querySelector(".entry-title").innerHTML;
    return title;
  }
}
