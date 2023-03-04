import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { GameInfo } from "./game-info";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Game Info",
  component: GameInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof GameInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    gameName: "Name of Game",
    onLeaveGame() {},
  },
};
