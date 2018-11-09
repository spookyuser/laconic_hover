import html from "innerself";
import { darkModeEnabled } from "../tvtropes-api";

export function HoverTemplate(trope) {

  return html`
    <div style="max-width:200px; text-align: left;">
      <p style="font-weight:bold; color: pink">${trope.title}
      </p>
      
      <p>${trope.laconic}</p>
    </div>
  `;
}
