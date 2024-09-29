import type { Meta, StoryObj } from "@storybook/react";

import { PlayerEstimation } from "./player-estimation.js";

const meta = {
  title: "Presentational/Player Estimation",
  component: PlayerEstimation,
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerEstimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    name: "name",
  },
};

export const Estimated: Story = {
  args: {
    name: "name",
    estimated: true,
  },
};
