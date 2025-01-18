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
    alias: [
      { find: "@spp/shared-domain/user-repository", replacement: path.resolve(path.join(__dirname, "node_modules", "@spp/infra-domain", "dist", "user-repository")) },
      { find: "@spp/shared-domain/game-repository", replacement: path.resolve(path.join(__dirname, "node_modules", "@spp/infra-domain", "dist", "game-repository")) },
      { find: "@spp/shared-domain/voting-repository", replacement: path.resolve(path.join(__dirname, "node_modules", "@spp/infra-domain", "dist", "voting-repository")) },
      { find: "@spp/infra-authenticator/base", replacement: path.resolve(path.join(__dirname, "node_modules", "@spp/infra-domain", "dist", "firebase-auth")) },
    ],
  },
});
