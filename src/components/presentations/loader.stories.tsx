import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Loader } from "./loader";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Loader",
  component: Loader,
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Invisible: Story = {
  args: {
    shown: false,
    size: "s",
  },
};

export const Small: Story = {
  args: {
    shown: true,
    size: "s",
  },
};

export const Medium: Story = {
  args: {
    shown: true,
    size: "m",
  },
};

export const Large: Story = {
  args: {
    shown: true,
    size: "l",
  },
};
