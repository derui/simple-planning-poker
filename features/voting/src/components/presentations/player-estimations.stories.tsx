import type { Meta, StoryObj } from "@storybook/react";

import { PlayerEstimations } from "./player-estimations.js";
import { PlayerEstimation } from "./player-estimation.js";

const meta = {
  title: "Presentational/Player Estimations",
  component: PlayerEstimations,
  tags: ["autodocs"],
  argTypes: {
    loading: { type: "boolean" },
  },
} satisfies Meta<typeof PlayerEstimations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    total: 4,
    estimated: 3,
    children: [
      <PlayerEstimation key="1" name="user1" />,
      <PlayerEstimation key="2" name="user2" estimated />,
      <PlayerEstimation key="3" name="user3" />,
    ],
  },
};

export const Large: Story = {
  args: {
    total: 6,
    estimated: 6,
    children: [
      <PlayerEstimation key="1" name="user1" />,
      <PlayerEstimation key="2" name="user2" estimated />,
      <PlayerEstimation key="3" name="user3" />,
      <PlayerEstimation key="4" name="user4" />,
      <PlayerEstimation key="5" name="user5" estimated />,
      <PlayerEstimation key="6" name="user6" />,
    ],
  },
};

export const Loading: Story = {
  args: {
    total: 1,
    estimated: 0,
    loading: true,
  },
};
