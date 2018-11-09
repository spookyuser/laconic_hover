import tippy from "tippy.js";
import { Trope } from "./tvtropes-api";
import "tippy.js/dist/tippy.css";

const HOVER_SELECTOR = ".twikilink";
const INITIAL_CONTENT = "Loading...";

console.log("Starting script");

tippy(HOVER_SELECTOR, {
  content: INITIAL_CONTENT,
  async onShow(tip) {
    const url = tip.reference.href;
    const trope = new Trope(url);
    const title = await trope.getTitle();

    try {
      if (tip.state.isVisible) {
        tip.setContent(title);
      }
    } catch (e) {
      tip.setContent(`Fetch failed. ${e}`);
      console.error(e);
    }
  },
  onHidden(tip) {
    tip.setContent(INITIAL_CONTENT);
  }
});
