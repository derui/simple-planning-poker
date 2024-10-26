import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { Toolbar } from "./toolbar.js";

const meta = {
  title: "Presentations/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultRole: "player",
  },
  render: (args) => (
    <div className={themeClass}>
      <Toolbar {...args} />
    </div>
  ),
};
