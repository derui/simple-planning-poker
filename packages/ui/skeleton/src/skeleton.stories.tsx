import { themeClass } from "@spp/ui-theme";
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
    <div className={themeClass} style={{ width: "100%", height: "100%" }}>
      <Skeleton />
    </div>
  ),
};
