import { LaconicError, Trope, darkModeEnabled } from "./api";
import {
  DARK_THEME,
  HOVER_SELECTOR,
  INITIAL_CONTENT,
  LIGHT_THEME,
} from "./config";
import { errorHoverTemplate, hoverTemplate } from "./hover-template";
import "./content-script.css";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import tippy, { followCursor } from "tippy.js";

export const config: PlasmoCSConfig = {
  matches: ["*://tvtropes.org/*"],
  run_at: "document_idle",
  all_frames: true,
};

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
    (async () => {
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
      let trope = new Trope(tip.reference.getAttribute("href")!);

      try {
        await trope.fetchLaconic();
        if (tip.state.isVisible) {
          tip.setContent(hoverTemplate(trope));
        }
      } catch (error) {
        tip.setContent(errorHoverTemplate(error, trope));
      }
    })();
  },
  onHidden(tip) {
    tip.setContent(INITIAL_CONTENT);
  },
});
