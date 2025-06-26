import { LaconicError, type Trope } from "./api";
import { html } from "common-tags";

export function createHoverTemplate({
  trope,
  error,
}: {
  trope?: Trope;
  error?: Error;
}) {
  const isNoLaconicError =
    error instanceof LaconicError && error.category === "NO_LACONIC";

  return html`
    <div class="laconic-hover">
      ${trope?.title
        ? html`
            <h1>${trope.title}</h1>
            <hr />
          `
        : ""}
      ${isNoLaconicError
        ? html`
            <p class="error">${LaconicError.messages.NO_LACONIC}</p>
          `
        : error?.message
        ? html`
            <p class="error">${error.message}</p>
          `
        : trope?.laconic
        ? html`
            <p>${trope.laconic}</p>
          `
        : ""}
      ${trope?.returnTo
        ? html`
            <hr />
            ${trope.returnTo}
            <hr />
          `
        : ""}
    </div>
  `;
}
