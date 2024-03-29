import type { Meta, StoryObj } from "@storybook/react";

import { UserInfoUpdater } from "./user-info-updater";
import { UserMode } from "@/domains/game-player";

const meta = {
  title: "Presentational/User Info Updater",
  component: UserInfoUpdater,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
    },
    mode: {
      options: [UserMode.inspector, UserMode.normal],
    },
  },
} satisfies Meta<typeof UserInfoUpdater>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inspector: Story = {
  args: {
    name: "User name",
    mode: UserMode.inspector,
  },
};

export const Normal: Story = {
  args: {
    name: "User name",
    mode: UserMode.normal,
  },
};
