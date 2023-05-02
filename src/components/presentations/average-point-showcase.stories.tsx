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
      { point: 1, count: 3 },
      { point: 2, count: 3 },
      { point: 3, count: 1 },
      { point: 5, count: 1 },
    ],
  },
};
