import tippy from "tippy.js";
import { Trope } from "./tvtropes-api";
import Constants from "./lib/constants";
import "tippy.js/dist/tippy.css";

console.log("Starting script");

tippy(Constants.HOVER_SELECTOR, {
  content: Constants.INITIAL_CONTENT,
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
    tip.setContent(Constants.INITIAL_CONTENT);
  }
});
