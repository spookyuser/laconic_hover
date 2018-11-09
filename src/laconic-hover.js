import tippy from "tippy.js";
import { HoverTemplate } from "./lib/templates";
import { Trope, darkModeEnabled } from "./lib/tvtropes-api";
import Constants from "./lib/constants";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/themes/light.css";

console.log("Starting script");

tippy(Constants.HOVER_SELECTOR, {
  content: Constants.INITIAL_CONTENT,
  async onShow(tip) {
    tip.reference.title = ""; // Disables built in browser tooltip floating on top of tippy
    tip.set({
      theme: darkModeEnabled() ? Constants.DARK_THEME : Constants.LIGHT_THEME
    });

    const url = tip.reference.href;
    const trope = new Trope(url);
    const info = await trope.toString();

    try {
      if (tip.state.isVisible) tip.setContent(HoverTemplate(info));
    } catch (e) {
      tip.setContent(`Fetch failed. ${e}`);
      console.error(e);
    }
  },
  onHidden(tip) {
    tip.setContent(Constants.INITIAL_CONTENT);
  },
  placement: "right",
  performance: true,
  animation: "perspective",
  delay: 100
});
