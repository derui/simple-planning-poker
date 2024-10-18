import type { Meta, StoryObj } from "@storybook/react";

import { SelectableCard } from "./selectable-card.js";

const meta = {
  title: "Presentations/Selectable card",
  component: SelectableCard,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselect: Story = {
  args: {
    children: "3",
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    children: "3",
    selected: true,
  },
};
