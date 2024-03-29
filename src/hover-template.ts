// import "data-text:./hover-template.css";
import { LaconicError, type Trope, darkModeEnabled } from "./api";
import { html } from "common-tags";

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

export function errorHoverTemplate(error: Error, trope?: Trope) {
  if (error instanceof LaconicError && error.category == "NO_LACONIC") {
    return html`
      <div class="laconic-hover">
        <p style="color: ${darkModeEnabled() ? "#71e1bc" : "#0849ab"}">
          ${trope?.title}
        </p>
        <hr />
        <p class="error-message">${LaconicError.messages.NO_LACONIC}</p>
      </div>
    `;
  } else
    return html`
      <div class="laconic-hover">
        <p style="color: ${darkModeEnabled() ? "#71e1bc" : "#0849ab"}">
          ${trope?.title}
        </p>
        ${error.message &&
        html`<hr />
          <p class="error-message">${error.message}</p> `}
      </div>
    `;
}
