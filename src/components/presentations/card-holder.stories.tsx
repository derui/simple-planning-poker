import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { CardHolder } from "./card-holder";
import twind from "@/twind.config.cjs";

install(twind);

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
