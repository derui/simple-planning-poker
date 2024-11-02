import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { ToggleButton } from "./toggle-button.js";

const meta: Meta<typeof ToggleButton> = {
  title: "Presentational/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  argTypes: {
    initialChecked: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialChecked: false,
  },
  render(args) {
    return (
      <div className={themeClass}>
        <ToggleButton {...args} />
      </div>
    );
  },
};
