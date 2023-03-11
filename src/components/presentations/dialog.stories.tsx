import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Dialog } from "./dialog";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    buttonState: ["disabled", "enabled", "loading"],
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    title: "sample",
    onSubmitClick() {},
    buttonState: "enabled",
  },
};

export const WithChildren: Story = {
  args: {
    title: "sample",
    onSubmitClick() {},
    buttonState: "enabled",
  },
  render(args) {
    return (
      <Dialog {...args}>
        <div className="w-full">inner object</div>
      </Dialog>
    );
  },
};
