import tippy from "tippy.js";
import { hoverTemplate } from "./templates/hover-template";
import { Trope } from "./lib/objects";
import { darkModeEnabled } from "./lib/utils";
import Constants from "./lib/constants";
import "tippy.js/dist/tippy.css";

tippy(Constants.HOVER_SELECTOR, {
  content: Constants.INITIAL_CONTENT,
  async onShow(tip) {
    tip.reference.title = ""; // Disables built in browser tooltip floating on top of tippy
    tip.set({
      theme: darkModeEnabled() ? Constants.DARK_THEME : Constants.LIGHT_THEME
    });

    const trope = await new Trope(tip.reference.href).toString();

    try {
      if (tip.state.isVisible) {
        tip.setContent(hoverTemplate(trope));
      }
    } catch (error) {
      tip.setContent(`Fetch failed. ${error}`);
    }
  },
  onHidden(tip) {
    tip.setContent(Constants.INITIAL_CONTENT);
  },
  placement: "top-start",
  performance: true,
  animation: "perspective",
  delay: 100
});
