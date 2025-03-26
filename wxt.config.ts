import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/auto-icons", "@wxt-dev/module-react"],
  manifest: {
    name: "Laconic Hover for TV Tropes",
    browser_specific_settings: {
      gecko: {
        id: "{c7a8881a-5be2-4f11-871b-9d5ea43c692c}",
        strict_min_version: "61.0",
      },
    },
    permissions: ["storage"],
  },
  vite: () => ({
    esbuild: {
      drop: ["console", "debugger"],
    },
    build: {
      minify: "esbuild",
      chunkSizeWarningLimit: 10000,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "SOURCEMAP_ERROR") {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
  }),
});
