import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-controls"],
  framework: "@storybook/react-vite",
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      resolve: {
        alias: {
          "@spp/shared-domain/game-repository": "@spp/shared-domain/mock/game-repository",
          "@spp/shared-domain/user-repository": "@spp/shared-domain/mock/user-repository",
        },
      },
    });
  },
  staticDirs: [{ from: "../../../app/public/static", to: "/static" }],
};
export default config;
