import { html } from "common-tags";
import { darkModeEnabled } from "../lib/utils";
import "./hover-template.css";

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
    <div class="laconic-hover">
      <p style="color: ${darkModeEnabled() ? "#71e1bc" : "#0849ab"}">
        ${trope.title}
      </p>
      <hr />
      <p>${trope.laconic}</p>
    </div>
  `;
}
