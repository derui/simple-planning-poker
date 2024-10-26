import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { PlayerEstimation } from "./player-estimation.js";

const meta = {
  title: "Presentations/Player Estimation",
  component: PlayerEstimation,
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerEstimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    name: "name",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <PlayerEstimation {...args} />
      </div>
    );
  },
};

export const Estimated: Story = {
  args: {
    name: "name",
    estimated: true,
  },
  render(args) {
    return (
      <div className={themeClass}>
        <PlayerEstimation {...args} />
      </div>
    );
  },
};
