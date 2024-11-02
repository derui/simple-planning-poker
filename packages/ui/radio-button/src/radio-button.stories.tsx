import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { RadioButton } from "./radio-button.js";

const meta: Meta<typeof RadioButton> = {
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
  render(args) {
    return (
      <div className={themeClass}>
        <RadioButton {...args} />
      </div>
    );
  },
};
