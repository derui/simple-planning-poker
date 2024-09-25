import type { Meta, StoryObj } from "@storybook/react";

import { Icon } from "./icon.js";
import { Icons } from "./icons.js";

const meta = {
  title: "UI/Icon",
  component: Icon,
  tags: ["autodocs"],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    type: Icons.check,
    size: "s",
  },
};

export const Medium: Story = {
  args: {
    type: Icons.check,
    size: "m",
  },
};

export const Large: Story = {
  args: {
    type: Icons.check,
    size: "l",
  },
};

export const ExtraLarge: Story = {
  args: {
    type: Icons.check,
    size: "xl",
  },
};
