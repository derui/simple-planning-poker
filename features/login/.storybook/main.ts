import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-controls"],
  framework: "@storybook/react-vite",
  docs: {
    autodocs: "tag",
  },

  previewHead: (head) => `
    ${head}
    <link rel="stylesheet" href="/style.css">
    `,

  staticDirs: [
    { from: "../../../app/public/static", to: "/static" },
    { from: "../dist/style.css", to: "/style.css" },
  ],
};
export default config;
