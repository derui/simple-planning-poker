import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";
import { RadioButton } from "./radio-button";
import { RadioGroup } from "./radio-group";

import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    return (
      <RadioGroup>
        <RadioButton label="one" value="one" name="radio" onChange={() => {}} checked />
        <RadioButton label="two" value="two" name="radio" onChange={() => {}} />
        <RadioButton label="three" value="three" name="radio" onChange={() => {}} />
      </RadioGroup>
    );
  },
};