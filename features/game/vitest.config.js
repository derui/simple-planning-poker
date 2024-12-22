import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: ["src/**/*.test.{ts,tsx}"],
      alias: {
        "@spp/shared-domain/game-repository": "@spp/shared-domain/mock/game-repository",
        "@spp/shared-domain/user-repository": "@spp/shared-domain/mock/user-repository",
      },
    },
  })
);
