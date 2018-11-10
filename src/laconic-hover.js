import tippy from "tippy.js";
import { hoverTemplate } from "./lib/templates";
import { Trope, darkModeEnabled } from "./lib/tvtropes-api";
import Constants from "./lib/constants";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/themes/light.css";

tippy(Constants.HOVER_SELECTOR, {
  content: Constants.INITIAL_CONTENT,
  async onShow(tip) {
    tip.reference.title = ""; // Disables built in browser tooltip floating on top of tippy
    tip.set({
      theme: darkModeEnabled() ? Constants.DARK_THEME : Constants.LIGHT_THEME
    });

    const trope = await new Trope(tip.reference.href).toString();

    try {
      if (tip.state.isVisible) tip.setContent(hoverTemplate(trope));
    } catch (error) {
      tip.setContent(`Fetch failed. ${error}`);
      console.error(error);
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
