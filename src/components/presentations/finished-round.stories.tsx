import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { FinishedRound } from "./finished-round";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Finished Round",
  component: FinishedRound,
  tags: ["autodocs"],
} satisfies Meta<typeof FinishedRound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoTheme: Story = {
  args: {
    id: "id",
    finishedAt: new Date("2023-01-03T11:12:13"),
    averagePoint: 3.5,
  },
};

export const HasTheme: Story = {
  args: {
    id: "id",
    theme: "A theme",
    finishedAt: new Date("2023-01-03T11:12:13"),
    averagePoint: 3.5,
  },
};
