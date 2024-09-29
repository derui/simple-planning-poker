import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "./skeleton.js";

const meta = {
  title: "Presentational/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full h-6">
      <Skeleton />
    </div>
  ),
};
