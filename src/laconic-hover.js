import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const HOVER_SELECTOR = ".twikilink";
const INITIAL_CONTENT = "Loading...";

const state = {
  isFetching: false,
  canFetch: true
};

console.log("Starting script");

tippy(HOVER_SELECTOR, {
  content: INITIAL_CONTENT,
  async onShow(tip) {
    if (state.isFetching || !state.canFetch) return;

    state.isFetching = true;
    state.canFetch = false;

    try {
      const url = tip.reference.href
    } catch (e) {
      tip.setContent(`Fetch failed. ${e}`);
    } finally {
      state.isFetching = false;
    }
  },
  onHidden(tip) {
    state.canFetch = true;
    tip.setContent(INITIAL_CONTENT);
  }
});
