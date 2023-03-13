import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { PlayerHands as PlayerHands } from "./player-hands";
import twind from "@/twind.config.cjs";
import { UserMode } from "@/domains/game-player";

install(twind);

const meta = {
  title: "Presentational/Player Hands",
  component: PlayerHands,
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerHands>;

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
