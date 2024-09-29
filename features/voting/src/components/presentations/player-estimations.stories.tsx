import type { Meta, StoryObj } from "@storybook/react";

import { PlayerEstimations } from "./player-estimations.js";

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
    total: 4,
    estimations: [
      { name: "user1", estimated: false },
      { name: "user2", estimated: true },
      { name: "user3", estimated: false },
    ],
  },
};

export const Large: Story = {
  args: {
    total: 6,
    estimations: [
      { name: "user1", estimated: true },
      { name: "user2", estimated: true },
      { name: "user3", estimated: true },
      { name: "user4", estimated: true },
      { name: "user5", estimated: true },
      { name: "user6", estimated: true },
    ],
  },
};

export const Loading: Story = {
  args: {
    total: 1,
    estimations: [],
    loading: true,
  },
};
