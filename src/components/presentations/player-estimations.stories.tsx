import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { PlayerEstimations } from "./player-estimations";
import twind from "@/twind.config.cjs";
import { UserMode } from "@/domains/game-player";

install(twind);

const meta = {
  title: "Presentational/Player Estimations",
  component: PlayerEstimations,
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerEstimations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    hands: [
      {
        displayValue: "1",
        state: "notSelected",
        userMode: UserMode.normal,
        userName: "user1",
      },
      {
        displayValue: "",
        state: "handed",
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
