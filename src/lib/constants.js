export default {
  // Query Selectors
  HOVER_SELECTOR: ".twikilink",
  DARK_MODE_COOKIE: "night-vision=true",

  // Elements
  TITLE: {
    querySelector: ".entry-title",
    property: "textContent"
  },
  LACONIC: {
    querySelector: "#main-article > p",
    property: "textContent"
  },

  // Strings
  INITIAL_CONTENT: "Loading...",
  NO_LACONIC: "No laconic page :(",
  NO_LACONIC_ERROR: "Inexact title",

  // Misc
  DARK_THEME: "dark",
  LIGHT_THEME: "light",
  CACHE_NAME: "laconic-hover-cache",
  DEFAULT_CHARACTER_ENCODING: "iso-8859-1"
};
