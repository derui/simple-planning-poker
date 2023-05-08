import type { Meta, StoryObj } from "@storybook/react";

import { SelectableCard } from "./selectable-card";

const meta = {
  title: "Presentational/Selectable card",
  component: SelectableCard,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselect: Story = {
  args: {
    display: "3",
    selected: false,
    onSelect() {},
  },
};

export const Selected: Story = {
  args: {
    display: "3",
    selected: true,
    onSelect() {},
  },
};
