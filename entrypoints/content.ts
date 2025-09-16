import { Trope } from "@/components/api";

import { createHoverTemplate } from "@/components/hover-template";
import "@/components/content-script.css";
import invariant from "tiny-invariant";
import tippy, { followCursor } from "tippy.js";
import { defineContentScript } from "wxt/sandbox";

const INITIAL_CONTENT = "Loading...";
const HOVER_SELECTOR =
  ".twikilink, .subpage-link[title='The Laconic page']:not(.curr-subpage), .section-links a";

export default defineContentScript({
  matches: ["*://tvtropes.org/*"],
  main() {
    tippy.setDefaultProps({
      placement: "top-start",
      ignoreAttributes: true,
      allowHTML: true,
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
          tip.reference.setAttribute("title", ""); // Disables built in browser tooltip floating on top of tippy

          tip.setProps({
            theme: document.querySelectorAll("#user-prefs.night-vision").length
              ? "dark"
              : "light",
          });

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
              tip.setContent(createHoverTemplate({ trope }));
            }
          } catch (error) {
            tip.setContent(
              createHoverTemplate({ error: error as Error, trope })
            );
          }
        })();
      },
      onHidden(tip) {
        tip.setContent(INITIAL_CONTENT);
      },
    });
  },
});
