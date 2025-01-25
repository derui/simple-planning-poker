import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { ThemeEditor } from "./theme-editor.js";

const meta: Meta<typeof ThemeEditor> = {
  title: "Presentations/ThemeEditor",
  component: ThemeEditor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: "Voting for something",
    onSubmit: console.log,
  },
  render: (args) => <div className={themeClass}>{<ThemeEditor {...args} />}</div>,
};

export const NoTheme: Story = {
  args: {
    theme: "",
  },
  render: (args) => <div className={themeClass}>{<ThemeEditor {...args} />}</div>,
};
