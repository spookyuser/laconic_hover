import { html } from "common-tags";
import { Trope } from "../lib/trope";
import { darkModeEnabled } from "../lib/darkmode";
import "./hover-template.css";

/** A small function that generates the custom HTML tippy will show when hovering on a trope
 *
 * It changes the title's color depending on whether dark mode
 * is enabled. The trope's title and laconic description
 * are interpolated into the html.
 */
export function hoverTemplate(trope: Trope) {
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
