import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { AveragePointShowcase } from "./average-point-showcase";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Average Point Showcase",
  component: AveragePointShowcase,
  tags: ["autodocs"],
} satisfies Meta<typeof AveragePointShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DisplayCount: Story = {
  args: {
    averagePoint: "5.32",
    cardCounts: [
      [1, 3],
      [2, 3],
      [3, 1],
      [5, 1],
    ],
  },
};
