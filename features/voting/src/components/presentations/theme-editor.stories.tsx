import type { Meta, StoryObj } from "@storybook/react";

import { ThemeEditor } from "./theme-editor.js";

const meta = {
  title: "Presentations/ThemeEditor",
  component: ThemeEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: "Voting for something",
    onSubmit: console.log,
  },
};
