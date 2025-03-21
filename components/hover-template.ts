import { LaconicError, type Trope, darkModeEnabled } from "./api";
import { html } from "common-tags";

function renderHeader(title?: string) {
  return html`
    <p style="color: ${darkModeEnabled() ? "#71e1bc" : "#0849ab"}">${title}</p>
    <hr class="laconic-hr" />
  `;
}

function renderReturnTo(htmlReturnTo?: string) {
  if (!htmlReturnTo) {
    return null;
  }

  return html`
    <hr class="tvtropes-hr" />
    ${htmlReturnTo}
    <hr class="tvtropes-hr" />
  `;
}

export function hoverTemplate(trope: Trope) {
  return html`
    <div class="laconic-hover">
      ${renderHeader(trope.title)}
      <p>${trope.laconic}</p>
      ${renderReturnTo(trope.returnTo)}
    </div>
  `;
}

export function errorHoverTemplate(error: Error, trope?: Trope) {
  if (error instanceof LaconicError && error.category === "NO_LACONIC") {
    return html`
      <div class="laconic-hover">
        ${renderHeader(trope?.title)}
        <p class="error-message">${LaconicError.messages.NO_LACONIC}</p>
      </div>
    `;
  }
  return html`
    <div class="laconic-hover">
      ${renderHeader(trope?.title)}
      ${error.message &&
      html`
        <hr class="laconic-hr" />
        <p class="error-message">${error.message}</p>
      `}
    </div>
  `;
}
