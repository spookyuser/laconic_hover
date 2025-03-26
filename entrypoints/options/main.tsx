import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App";
import "@radix-ui/themes/styles.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>
);
