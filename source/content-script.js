import tippy, { followCursor } from "tippy.js";
import { hoverTemplate } from "./templates/hover-template";
import { Trope } from "./lib/objects";
import { darkModeEnabled } from "./lib/utils";
import Constants from "./lib/constants";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/animations/perspective.css";

tippy.setDefaultProps({
  placement: "top-start",
  ignoreAttributes: true,
  allowHTML: true,
  appendTo: "parent",
  animation: "perspective",
  delay: 100,
  plugins: [followCursor],
  popperOptions: {
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
          tether: false,
        },
      },
    ],
  },
});

tippy(Constants.HOVER_SELECTOR, {
  content: Constants.INITIAL_CONTENT,
  async onShow(tip) {
    tip.setProps({
      theme: darkModeEnabled() ? Constants.DARK_THEME : Constants.LIGHT_THEME,
    });
    tip.reference.title = ""; // Disables built in browser tooltip floating on top of tippy
    if (tip.reference.firstChild.firstChild instanceof HTMLImageElement) {
      // Only follow cursor on images
      tip.setProps({
        followCursor: true,
        animation: "",
        placement: "top",
      });
    }

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
});
