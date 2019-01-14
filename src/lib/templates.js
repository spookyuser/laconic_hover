import html from "innerself";
import { darkModeEnabled } from "./utils";

export function hoverTemplate(trope) {
  return html`
    <div
      style="max-width:300px; text-align: left; font-family: 'Nunito', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;"
    >
      <p
        style="font-weight:bold; color: ${
          darkModeEnabled() ? "#71e1bc" : "#0849ab"
        }; font-size: 1.2rem"
      >
        ${trope.title}
      </p>
      <hr style="opacity: 0.1; " />
      <p style="font-size: 1rem;">${trope.laconic}</p>
    </div>
  `;
}
