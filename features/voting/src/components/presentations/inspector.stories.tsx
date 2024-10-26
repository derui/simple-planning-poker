import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { Inspector } from "./inspector.js";

const meta = {
  title: "Presentations/inspector",
  component: Inspector,
  tags: ["autodocs"],
} satisfies Meta<typeof Inspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "foobar",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Inspector {...args} />
      </div>
    );
  },
};
