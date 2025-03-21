import { Trope, darkModeEnabled } from "@/components/api";
import {
  DARK_THEME,
  HOVER_SELECTOR,
  INITIAL_CONTENT,
  LIGHT_THEME,
} from "@/components/config";
import { errorHoverTemplate, hoverTemplate } from "@/components/hover-template";
import "@/components/content-script.css";
import tippy, { followCursor } from "tippy.js";
import invariant from "tiny-invariant";
export default defineContentScript({
  matches: ["*://tvtropes.org/*"],
  main() {
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

          if (
            tip.reference.firstChild?.firstChild instanceof HTMLImageElement
          ) {
            // Only follow cursor on images
            tip.setProps({
              followCursor: true,
              animation: "",
              placement: "top",
            });
          }
          const href = tip.reference.getAttribute("href");
          invariant(href);
          const trope = new Trope(href);

          try {
            await trope.fetchLaconic();
            if (tip.state.isVisible) {
              tip.setContent(hoverTemplate(trope));
            }
          } catch (error) {
            tip.setContent(errorHoverTemplate(error as Error, trope));
          }
        })();
      },
      onHidden(tip) {
        tip.setContent(INITIAL_CONTENT);
      },
    });
  },
});
