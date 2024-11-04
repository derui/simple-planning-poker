import type { Meta, StoryObj } from "@storybook/react";

import { Variant } from "@spp/shared-color-variant";
import { themeClass } from "@spp/ui-theme";
import { Icon } from "./index.js";
import { IconProps } from "./props.js";

const meta: Meta<IconProps> = {
  title: "UI/Icon",
  argTypes: {
    variant: { control: "select", options: Object.keys(Variant) },
  },
  tags: ["autodocs"],
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<IconProps>;

export const Check: Story = {
  args: {
    size: "m",
  },
  render(args) {
    return <Icon.Check {...args} />;
  },
};

export const Eye: Story = {
  args: {
    size: "m",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Icon.Check {...args} />
      </div>
    );
  },
};

export const Loader2: Story = {
  args: {
    size: "m",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Icon.Check {...args} />
      </div>
    );
  },
};

export const Pencil: Story = {
  args: {
    size: "m",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Icon.Pencil {...args} />
      </div>
    );
  },
};

export const User: Story = {
  args: {
    size: "m",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Icon.User {...args} />
      </div>
    );
  },
};

export const X: Story = {
  args: {
    size: "m",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Icon.X {...args} />
      </div>
    );
  },
};

export const Plus: Story = {
  args: {
    size: "m",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Icon.Plus {...args} />
      </div>
    );
  },
};
