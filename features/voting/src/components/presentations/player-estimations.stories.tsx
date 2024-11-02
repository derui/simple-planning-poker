import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { PlayerEstimations } from "./player-estimations.js";

const meta: Meta<typeof PlayerEstimations> = {
  title: "Presentations/Player Estimations",
  component: PlayerEstimations,
  tags: ["autodocs"],
  argTypes: {
    loading: { type: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    total: 4,
    estimations: [{ name: "user1" }, { name: "user2", estimated: "1" }, { name: "user3" }],
  },
  render(args) {
    return (
      <div className={themeClass}>
        <PlayerEstimations {...args} />
      </div>
    );
  },
};

export const Large: Story = {
  args: {
    total: 6,
    estimations: [
      { name: "user1", estimated: "3" },
      { name: "user2", estimated: "3" },
      { name: "user3", estimated: "2" },
      { name: "user4", estimated: "1" },
      { name: "user5", estimated: "1" },
      { name: "user6", estimated: "4" },
    ],
  },
  render(args) {
    return (
      <div className={themeClass}>
        <PlayerEstimations {...args} />
      </div>
    );
  },
};

export const Loading: Story = {
  args: {
    total: 1,
    estimations: [],
    loading: true,
  },

  render(args) {
    return (
      <div className={themeClass}>
        <PlayerEstimations {...args} />
      </div>
    );
  },
};
