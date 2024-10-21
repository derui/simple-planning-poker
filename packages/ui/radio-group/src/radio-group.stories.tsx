import type { Meta, StoryObj } from "@storybook/react";

import { RadioButton } from "@spp/ui-radio-button";
import { themeClass } from "@spp/ui-theme";
import { RadioGroup } from "./radio-group.js";

const meta = {
  title: "UI/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    return (
      <div className={themeClass}>
        <RadioGroup>
          <RadioButton label="one" value="one" name="radio" onChange={() => {}} checked />
          <RadioButton label="two" value="two" name="radio" onChange={() => {}} />
          <RadioButton label="three" value="three" name="radio" onChange={() => {}} />
        </RadioGroup>
      </div>
    );
  },
};
