import type { Meta, StoryObj } from "@storybook/react";

import { CardHolder } from "./card-holder";

const meta = {
  title: "Presentational/Card Holder",
  component: CardHolder,
  tags: ["autodocs"],
} satisfies Meta<typeof CardHolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    displays: ["1", "2", "3", "5", "?"],
    selectedIndex: -1,
    onSelect() {},
  },
};
