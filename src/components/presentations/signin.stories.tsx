import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { SignIn } from "./signin";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/User Sign In",
  component: SignIn,
  tags: ["autodocs"],
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoChildren: Story = {
  args: {
    title: "Sign In",
    authenticating: false,
    onSubmit() {},
  },
};

export const WithChildren: Story = {
  args: {
    title: "Sign In",
    authenticating: false,
    onSubmit() {},
  },
  render(args) {
    return <SignIn {...args}>We are children</SignIn>;
  },
};
