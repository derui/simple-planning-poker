import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { SelectableCard } from "./selectable-card";
import twind from "@/twind.config.cjs";

install(twind);

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
