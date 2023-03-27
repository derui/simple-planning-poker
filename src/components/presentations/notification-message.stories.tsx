import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { NotificationMessage } from "./notification-message";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Notification Message",
  component: NotificationMessage,
  tags: ["autodocs"],
} satisfies Meta<typeof NotificationMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    type: "info",
  },

  render(args) {
    return <NotificationMessage {...args}>A message</NotificationMessage>;
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
  },
  render(args) {
    return <NotificationMessage {...args}>A message</NotificationMessage>;
  },
};

export const Alert: Story = {
  args: {
    type: "alert",
  },
  render(args) {
    return <NotificationMessage {...args}>A message</NotificationMessage>;
  },
};
