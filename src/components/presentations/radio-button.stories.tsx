import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";
import { RadioButton } from "./radio-button";

import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Radio Button",
  component: RadioButton,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "name",
    value: "value",
    label: "label",
    onCheck: () => {},
    checked: false,
  },
};
