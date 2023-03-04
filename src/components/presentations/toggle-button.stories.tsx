import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";
import { ToggleButton } from "./toggle-button";

import twind from "@/twind.config.cjs";

install(twind);

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
    initialChecked: false,
  },
};
