import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
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
  render: (args) => <div className={themeClass}>{<SelectableCard {...args} />}</div>,
};

export const Selected: Story = {
  args: {
    children: "3",
    selected: true,
  },
  render: (args) => <div className={themeClass}>{<SelectableCard {...args} />}</div>,
};
