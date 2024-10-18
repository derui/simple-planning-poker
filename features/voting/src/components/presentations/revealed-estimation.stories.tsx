import type { Meta, StoryObj } from "@storybook/react";

import { RevealedEstimation } from "./revealed-estimation.js";

const meta = {
  title: "Presentations/Revealed Estimation",
  component: RevealedEstimation,
  tags: ["autodocs"],
} satisfies Meta<typeof RevealedEstimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    name: "name",
    children: "value",
  },
};
