import type { Meta, StoryObj } from "@storybook/react";

import { PlayerEstimations } from "./player-estimations";
import { UserMode } from "@/domains/game-player";

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
    estimations: [
      {
        displayValue: "1",
        state: "notSelected",
        userMode: UserMode.normal,
        userName: "user1",
      },
      {
        displayValue: "",
        state: "estimated",
        userMode: UserMode.normal,
        userName: "user2",
      },
      {
        displayValue: "",
        state: "result",
        userMode: UserMode.inspector,
        userName: "user3",
      },
    ],
  },
};
