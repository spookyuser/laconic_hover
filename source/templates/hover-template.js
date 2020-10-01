import { html } from "common-tags";
import { darkModeEnabled } from "../lib/utils";

/** A small function that generates the custom HTML tippy will show when hovering on a trope
 *
 * It changes the title's color depending on whether dark mode
 * is enabled. The trope's title and laconic description
 * are interpolated into the html.
 *
 * @returns {String} HTML describing a "card" with the trope's title and laconic
 * @param {Trope} trope An instance of a Trope object
 */
export function hoverTemplate(trope) {
  return html`
    <div
      style="max-width:300px; text-align: left; font-family: 'Nunito', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;"
    >
      <p
        style="font-weight:bold; color: ${darkModeEnabled()
          ? "#71e1bc"
          : "#0849ab"}; font-size: 1.2rem"
      >
        ${trope.title}
      </p>
      <hr style="opacity: 0.1; margin-block-start: 0.5em; margin-block-end: 0.5em" />
      <p style="font-size: 1rem;">${trope.laconic}</p>
    </div>
  `;
}
