import type { Meta, StoryObj } from "@storybook/react";

import { ToggleButton } from "./toggle-button";

const meta = {
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
    onToggle: () => {},
    initialChecked: false,
  },
};
