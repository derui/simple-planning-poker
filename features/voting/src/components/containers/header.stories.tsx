import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./header.js";

const meta = {
  title: "Presentations/Header",
  component: Header,
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: "Voting",
    defaultRole: "player",
  },
};
