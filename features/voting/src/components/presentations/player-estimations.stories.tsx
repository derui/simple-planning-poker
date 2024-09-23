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
    children: [
      <PlayerEstimation key="1" name="user1"></PlayerEstimation>,
      <PlayerEstimation key="2" name="user2" estimated>
        {" "}
      </PlayerEstimation>,
      <PlayerEstimation key="3" name="user3">
        {" "}
      </PlayerEstimation>,
    ],
  },
};

export const Large: Story = {
  args: {
    children: [
      <PlayerEstimation key="1" name="user1"></PlayerEstimation>,
      <PlayerEstimation key="2" name="user2" estimated>
        {" "}
      </PlayerEstimation>,
      <PlayerEstimation key="3" name="user3">
        {" "}
      </PlayerEstimation>,
      <PlayerEstimation key="4" name="user4"></PlayerEstimation>,
      <PlayerEstimation key="5" name="user5" estimated>
        {" "}
      </PlayerEstimation>,
      <PlayerEstimation key="6" name="user6">
        {" "}
      </PlayerEstimation>,
    ],
  },
};

export const Loading: Story = {
  args: {
    children: [],
    loading: true,
  },
};
