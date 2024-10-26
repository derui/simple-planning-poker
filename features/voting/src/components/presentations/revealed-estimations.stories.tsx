import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { RevealedEstimations } from "./revealed-estimations.js";

const meta = {
  title: "Presentations/Revealed Estimations",
  component: RevealedEstimations,
  tags: ["autodocs"],
  argTypes: {
    loading: { type: "boolean" },
  },
} satisfies Meta<typeof RevealedEstimations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    average: 2.5,
    estimations: [
      { name: "user1", estimated: "1" },
      { name: "user2", estimated: "3" },
      { name: "user3", estimated: "4" },
    ],
  },
  render: (args) => (
    <div className={themeClass}>
      <RevealedEstimations {...args} />
    </div>
  ),
};

export const Large: Story = {
  args: {
    average: 4.587,
    estimations: [
      { name: "user1", estimated: "3" },
      { name: "user2", estimated: "4" },
      { name: "user3", estimated: "5" },
      { name: "user4", estimated: "6" },
      { name: "user5", estimated: "7" },
      { name: "user6", estimated: "8" },
    ],
  },
  render: (args) => (
    <div className={themeClass}>
      <RevealedEstimations {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    estimations: [],
    loading: true,
  },
  render: (args) => (
    <div className={themeClass}>
      <RevealedEstimations {...args} />
    </div>
  ),
};
