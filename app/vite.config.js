import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const isProduction = process.env["NODE_ENV"] === "production";
const isCI = process.env["CI"] === "true";

export default defineConfig({
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
    jsx: isProduction ? "react-jsx" : "react-jsxdev",
  },
  define: {
    "process.env": {
      CI: isCI ? "ci" : "",
    },
  },
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      "./firebase.config": path.join(__dirname, "src", isProduction ? "firebase.config.prod" : "firebase.config"),
      "@spp/shared-domain/user-repository": "@spp/infra-domain/user-repository",
      "@spp/shared-domain/game-repository": "@spp/infra-domain/game-repository",
      "@spp/shared-domain/voting-repository": "@spp/infra-domain/voting-repository",
      "@spp/infra-authenticator/base": "@spp/infra-authenticator/firebase",
    },
  },
});
