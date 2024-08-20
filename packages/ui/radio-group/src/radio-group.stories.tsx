import type { Meta, StoryObj } from "@storybook/react";

import { RadioButton } from "@spp/ui-radio-button";
import { RadioGroup } from "./radio-group";

const meta = {
  title: "UI/Radio Group",
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
