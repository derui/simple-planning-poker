import type { Meta, StoryObj } from "@storybook/react";

import { KickableUserItem } from "./kickable-user-item";

const meta = {
  title: "Presentational/Kickable User Item",
  component: KickableUserItem,
  tags: ["autodocs"],
} satisfies Meta<typeof KickableUserItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotKickable: Story = {
  args: {
    name: "name of user",
  },
};

export const Kickable: Story = {
  args: {
    name: "name of user",
    onKick: () => {},
  },
};

export const Loading: Story = {
  args: {
    name: "name of user",
    onKick: () => {},
    loading: true,
  },
};
