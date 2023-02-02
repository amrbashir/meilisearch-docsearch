import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";
import { readFileSync } from "fs";

export default defineConfig((config) => [
  {
    entry: ["src/index.tsx"],
    format: "esm",
    dts: true,
    clean: !config.watch,
    minify: !config.watch,
    esbuildPlugins: [solidPlugin()],
  },
  {
    entry: ["src/index.solid.tsx"],
    format: "esm",
    dts: true,
    clean: !config.watch,
    minify: !config.watch,
    esbuildOptions: () => ({
      jsx: "preserve",
    }),
    outExtension: () => ({
      js: ".jsx",
    }),
    env: {
      VERSION: JSON.parse(readFileSync("package.json", "utf-8")).version,
    },
  },
  {
    entry: [
      "src/styles/index.css",
      "src/styles/variables.css",
      "src/styles/button.css",
      "src/styles/modal.css",
    ],
    clean: !config.watch,
    minify: !config.watch,
  },
]);
