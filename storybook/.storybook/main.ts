import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  framework: "@storybook/react-vite",
  docs: {
    autodocs: "tag",
  },
  staticDirs: [
    { from: "../../app/public/static", to: "/static" },
    { from: "../books", to: "/books" },
  ],
  refs: {
    "feature-game": {
      title: "Feature/Game",
      url: "books/feature/game/",
    },
    "feature-voting": {
      title: "Feature/Voting",
      url: "books/feature/voting/",
    },
    "feature-login": {
      title: "Feature/Login",
      url: "books/feature/login/",
    },
  },
};
export default config;
