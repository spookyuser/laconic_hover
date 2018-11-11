export default {
  // Query Selectors
  HOVER_SELECTOR: ".twikilink",
  TITLE_SELECTOR: {
    querySelector: ".entry-title",
    property: "textContent"
  },
  LACONIC_SELECTOR: {
    querySelector: "meta[property='og:description']",
    property: "content"
  },
  DARK_MODE_COOKIE: "night-vision=true",

  // Strings
  INITIAL_CONTENT: "Loading...",
  NO_LACONIC: "No laconic page :(",

  // Misc
  DARK_THEME: "dark",
  LIGHT_THEME: "light"
};
