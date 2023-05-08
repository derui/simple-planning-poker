import type { Meta, StoryObj } from "@storybook/react";

import { PlayerEstimation } from "./player-estimation";
import { UserMode } from "@/domains/game-player";

const meta = {
  title: "Presentational/Player Estimation",
  component: PlayerEstimation,
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerEstimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    state: "notSelected",
    displayValue: "value",
  },
};

export const Inspector: Story = {
  args: {
    userName: "name",
    userMode: UserMode.inspector,
    state: "notSelected",
    displayValue: "value",
  },
};

export const InspectorOpened: Story = {
  args: {
    userName: "name",
    userMode: UserMode.inspector,
    state: "notSelected",
    displayValue: "value",
  },
};

export const NormalSelected: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    state: "estimated",
    displayValue: "value",
  },
};

export const NormalSelectedAndOpened: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    state: "result",
    displayValue: "value",
  },
};

export const NormalUnselectedAndOpened: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    state: "notSelected",
    displayValue: "value",
  },
};
