import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { RevealedEstimations } from "./revealed-estimations.js";

const meta: Meta<typeof RevealedEstimations> = {
  title: "Presentations/Revealed Estimations",
  component: RevealedEstimations,
  tags: ["autodocs"],
  argTypes: {
    loading: { type: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    average: 2.5,
    estimations: [
      { name: "user1", estimated: "1", loginUser: false },
      { name: "user2", estimated: "3", loginUser: false },
      { name: "user3", estimated: "4", loginUser: false },
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
      { name: "user1", estimated: "3", loginUser: false },
      { name: "user2", estimated: "4", loginUser: false },
      { name: "user3", estimated: "5", loginUser: false },
      { name: "user4", estimated: "6", loginUser: false },
      { name: "user5", estimated: "7", loginUser: false },
      { name: "user6", estimated: "8", loginUser: false },
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
