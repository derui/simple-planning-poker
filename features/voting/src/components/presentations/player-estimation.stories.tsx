import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { PlayerEstimation } from "./player-estimation.js";

const meta: Meta<typeof PlayerEstimation> = {
  title: "Presentations/Player Estimation",
  component: PlayerEstimation,
  tags: ["autodocs"],
};

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
    estimated: "3",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <PlayerEstimation {...args} />
      </div>
    );
  },
};
