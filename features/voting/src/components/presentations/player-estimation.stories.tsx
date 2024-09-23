import type { Meta, StoryObj } from "@storybook/react";

import { PlayerEstimation } from "./player-estimation.js";

const meta = {
  title: "Presentational/Player Estimation",
  component: PlayerEstimation,
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerEstimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    name: "name",
    mode: "player",
    state: "notSelected",
    children: "value",
  },
};

export const Inspector: Story = {
  args: {
    name: "name",
    mode: "inspector",
    state: "notSelected",
    children: "value",
  },
};

export const InspectorOpened: Story = {
  args: {
    name: "name",
    mode: "inspector",
    state: "notSelected",
    children: "value",
  },
};

export const NormalSelected: Story = {
  args: {
    name: "name",
    mode: "player",
    state: "estimated",
    children: "value",
  },
};

export const NormalSelectedAndOpened: Story = {
  args: {
    name: "name",
    mode: "player",
    state: "revealed",
    children: "value",
  },
};

export const NormalUnselectedAndOpened: Story = {
  args: {
    name: "name",
    mode: "player",
    state: "notSelected",
    children: "value",
  },
};
