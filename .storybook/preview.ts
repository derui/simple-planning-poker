import type { Preview } from "@storybook/react";
import { setup } from "@twind/core";
import config from "../src/twind.config.cjs";

setup(config);

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
