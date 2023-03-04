import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { PlayerHand } from "./player-hand";
import twind from "@/twind.config.cjs";
import { UserMode } from "@/domains/game-player";

install(twind);

const meta = {
  title: "Presentational/Player Hand",
  component: PlayerHand,
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerHand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    selected: false,
    displayValue: "value",
    opened: false,
  },
};

export const Inspector: Story = {
  args: {
    userName: "name",
    userMode: UserMode.inspector,
    selected: false,
    displayValue: "value",
    opened: false,
  },
};

export const InspectorOpened: Story = {
  args: {
    userName: "name",
    userMode: UserMode.inspector,
    selected: false,
    displayValue: "value",
    opened: true,
  },
};

export const NormalSelected: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    selected: true,
    displayValue: "value",
    opened: false,
  },
};

export const NormalSelectedAndOpened: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    selected: true,
    displayValue: "value",
    opened: true,
  },
};

export const NormalUnselectedAndOpened: Story = {
  args: {
    userName: "name",
    userMode: UserMode.normal,
    selected: false,
    displayValue: "value",
    opened: true,
  },
};
