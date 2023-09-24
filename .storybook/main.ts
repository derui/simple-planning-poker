import type { StorybookConfig } from "@storybook/react-vite";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-controls"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },

  staticDirs: [{ from: "../public/static", to: "/static" }],
};
export default config;
