import type { Meta, StoryObj } from "@storybook/react";

import { RadioButton } from "./radio-button";

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
    onChange: () => {},
    checked: false,
  },
};
