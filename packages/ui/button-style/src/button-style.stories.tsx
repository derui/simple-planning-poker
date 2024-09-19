import type { Meta, StoryObj } from "@storybook/react";

import { buttonStyle, Props } from "./button-style.js";

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
    variant: "gray",
  },
};
export const Blue: Story = {
  args: {
    variant: "blue",
  },
};
export const Teal: Story = {
  args: {
    variant: "teal",
  },
};
export const Emerald: Story = {
  args: {
    variant: "emerald",
  },
};
export const Orange: Story = {
  args: {
    variant: "orange",
  },
};
export const Chestnut: Story = {
  args: {
    variant: "chestnut",
  },
};
export const Cerise: Story = {
  args: {
    variant: "cerise",
  },
};
export const Purple: Story = {
  args: {
    variant: "purple",
  },
};

export const Indigo: Story = {
  args: {
    variant: "indigo",
  },
};
