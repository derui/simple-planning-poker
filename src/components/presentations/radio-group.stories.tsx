import type { Meta, StoryObj } from "@storybook/react";

import { RadioButton } from "./radio-button";
import { RadioGroup } from "./radio-group";

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
        <RadioButton label="one" value="one" name="radio" onCheck={() => {}} checked />
        <RadioButton label="two" value="two" name="radio" onCheck={() => {}} />
        <RadioButton label="three" value="three" name="radio" onCheck={() => {}} />
      </RadioGroup>
    );
  },
};
