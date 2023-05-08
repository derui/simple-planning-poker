import type { Meta, StoryObj } from "@storybook/react";

import { RoundHistory } from "./round-history";

const meta = {
  title: "Presentational/Finished Round",
  component: RoundHistory,
  tags: ["autodocs"],
} satisfies Meta<typeof RoundHistory>;

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
