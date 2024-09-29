import type { Meta, StoryObj } from "@storybook/react";

import { AveragePointShowcase } from "./average-point-showcase";

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
