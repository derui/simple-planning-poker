import type { Meta, StoryObj } from "@storybook/react";

import { Variant } from "@spp/shared-color-variant";
import { themeClass } from "@spp/ui-theme";
import { Loader } from "./loader.js";

const meta: Meta<typeof Loader> = {
  title: "UI/Loader",
  component: Loader,
  argTypes: {
    variant: { control: "select", options: Object.keys(Variant) },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Invisible: Story = {
  args: {
    shown: false,
    size: "s",
  },
  render: (args) => (
    <div className={themeClass}>
      <Loader {...args} />
    </div>
  ),
};

export const Small: Story = {
  args: {
    shown: true,
    size: "s",
  },
  render: (args) => (
    <div className={themeClass}>
      <Loader {...args} />
    </div>
  ),
};

export const Medium: Story = {
  args: {
    shown: true,
    size: "m",
  },
  render: (args) => (
    <div className={themeClass}>
      <Loader {...args} />
    </div>
  ),
};

export const Large: Story = {
  args: {
    shown: true,
    size: "l",
  },
  render: (args) => (
    <div className={themeClass}>
      <Loader {...args} />
    </div>
  ),
};
