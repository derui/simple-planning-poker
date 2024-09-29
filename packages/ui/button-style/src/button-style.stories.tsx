import type { Meta, StoryObj } from "@storybook/react";

import { buttonStyle, Props } from "./button-style.js";
import { Variant } from "@spp/shared-color-variant";

const B = (props: Props) => {
  const style = buttonStyle(props);

  return <button className={style}>Button </button>;
};

const meta = {
  title: "UI/buttonStyle",
  component: B,
  argTypes: {
    disabled: {
      control: { type: "boolean" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof B>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gray: Story = {
  args: {
    variant: Variant.gray,
  },
};
export const Blue: Story = {
  args: {
    variant: Variant.blue,
  },
};
export const IconButton: Story = {
  args: {
    variant: Variant.blue,
    iconButton: true,
  },
};
export const Teal: Story = {
  args: {
    variant: Variant.teal,
  },
};
export const Emerald: Story = {
  args: {
    variant: Variant.emerald,
  },
};
export const Orange: Story = {
  args: {
    variant: Variant.orange,
  },
};
export const Chestnut: Story = {
  args: {
    variant: Variant.chestnut,
  },
};
export const Cerise: Story = {
  args: {
    variant: Variant.cerise,
  },
};
export const Purple: Story = {
  args: {
    variant: Variant.purple,
  },
};

export const Indigo: Story = {
  args: {
    variant: Variant.indigo,
  },
};
