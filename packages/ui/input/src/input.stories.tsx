import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { Input } from "./input.js";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    return (
      <div className={themeClass}>
        <Input />
      </div>
    );
  },
};
export const Invalid: Story = {
  args: {
    "aria-invalid": true,
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Input {...args} />
      </div>
    );
  },
};
