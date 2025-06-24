import { LaconicError, type Trope, darkModeEnabled } from "./api";
import { html } from "common-tags";

export function createHoverTemplate({
  trope,
  error,
}: {
  trope?: Trope;
  error?: Error;
}) {
  const headerColor = darkModeEnabled() ? "#71e1bc" : "#0849ab";

  const isNoLaconicError =
    error instanceof LaconicError && error.category === "NO_LACONIC";

  return html`
    <div class="laconic-hover article-content">
      ${trope?.title
        ? html`
            <p style="color: ${headerColor}">${trope.title}</p>
            <hr class="laconic-hr" />
          `
        : ""}
      ${isNoLaconicError
        ? html`
            <p class="error-message">${LaconicError.messages.NO_LACONIC}</p>
          `
        : error?.message
        ? html`
            <p class="error-message">${error.message}</p>
          `
        : trope?.laconic
        ? html`
            <p>${trope.laconic}</p>
          `
        : ""}
      ${trope?.returnTo
        ? html`
            <hr class="tvtropes-hr" />
            ${trope.returnTo}
            <hr class="tvtropes-hr" />
          `
        : ""}
    </div>
  `;
}
