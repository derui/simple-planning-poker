import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { UserInfoUpdater } from "./user-info-updater";
import twind from "@/twind.config.cjs";
import { UserMode } from "@/domains/game-player";

install(twind);

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
