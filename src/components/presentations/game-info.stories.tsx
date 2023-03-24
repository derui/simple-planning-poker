import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { MemoryRouter } from "react-router";
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

  render(args) {
    return (
      <MemoryRouter>
        <GameInfo {...args} />
      </MemoryRouter>
    );
  },
};

export const Owner: Story = {
  args: {
    gameName: "Name of Game",
    onLeaveGame() {},
    owner: true,
  },

  render(args) {
    return (
      <MemoryRouter>
        <GameInfo {...args} />
      </MemoryRouter>
    );
  },
};
