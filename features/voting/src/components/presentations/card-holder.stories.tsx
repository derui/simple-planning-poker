import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { CardHolder } from "./card-holder.js";
import { SelectableCard } from "./selectable-card.js";

const meta = {
  title: "Presentations/CardHolder",
  component: CardHolder,
  tags: ["autodocs"],
} satisfies Meta<typeof CardHolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Player: Story = {
  args: {
    type: "player",
    children: [
      <SelectableCard>1</SelectableCard>,
      <SelectableCard>3</SelectableCard>,
      <SelectableCard>7</SelectableCard>,
      <SelectableCard>9</SelectableCard>,
    ],
  },
};

export const Inspector: Story = {
  args: {
    type: "inspector",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <CardHolder {...args} />
      </div>
    );
  },
};
