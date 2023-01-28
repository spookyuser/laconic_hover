import tippy, { followCursor } from "tippy.js";
import { hoverTemplate } from "./templates/hover-template";
import { darkModeEnabled } from "./lib/darkmode";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/animations/perspective.css";
import "./content-script.css";
import {
  DARK_THEME,
  HOVER_SELECTOR,
  INITIAL_CONTENT,
  LIGHT_THEME,
} from "./config";
import { Trope } from "./lib/Trope";

tippy.setDefaultProps({
  placement: "top-start",
  ignoreAttributes: true,
  allowHTML: true,
  appendTo: "parent",
  animation: "perspective",
  delay: 100,
  content: INITIAL_CONTENT,
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

tippy(HOVER_SELECTOR, {
  onShow(tip) {
    tip.setProps({
      theme: darkModeEnabled() ? DARK_THEME : LIGHT_THEME,
    });
    tip.reference.setAttribute("title", ""); // Disables built in browser tooltip floating on top of tippy
    if (tip.reference.firstChild!.firstChild instanceof HTMLImageElement) {
      // Only follow cursor on images
      tip.setProps({
        followCursor: true,
        animation: "",
        placement: "top",
      });
    }
    new Trope(tip.reference.getAttribute("href")!)
      .fetchLaconic()
      .then((laconic) => {
        try {
          if (tip.state.isVisible) {
            tip.setContent(hoverTemplate(laconic));
          }
        } catch (error) {
          tip.setContent(`Fetch failed. ${error}`);
        }
      });
  },
  onHidden(tip) {
    tip.setContent(INITIAL_CONTENT);
  },
});
