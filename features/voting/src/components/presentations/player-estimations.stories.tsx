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
      <PlayerEstimation key="1" name="user1" mode="player" state="notSelected">
        1
      </PlayerEstimation>,
      <PlayerEstimation key="2" name="user2" mode="player" state="estimated">
        1
      </PlayerEstimation>,
      <PlayerEstimation key="3" name="user3" mode="inspector" state="revealed">
        1
      </PlayerEstimation>,
    ],
  },
};

export const Large: Story = {
  args: {
    children: [
      <PlayerEstimation key="1" name="user1" mode="player" state="notSelected">
        1
      </PlayerEstimation>,
      <PlayerEstimation key="2" name="user2" mode="player" state="estimated">
        1
      </PlayerEstimation>,
      <PlayerEstimation key="3" name="user3" mode="inspector" state="revealed">
        1
      </PlayerEstimation>,
      <PlayerEstimation key="4" name="user4" mode="player" state="notSelected">
        1
      </PlayerEstimation>,
      <PlayerEstimation key="5" name="user5" mode="player" state="estimated">
        1
      </PlayerEstimation>,
      <PlayerEstimation key="6" name="user6" mode="inspector" state="revealed">
        1
      </PlayerEstimation>,
    ],
  },
};
