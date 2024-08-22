import type { Meta, StoryObj } from "@storybook/react";

import { RoundHistory } from "./round-history";

const meta = {
  title: "Presentational/Round History",
  component: RoundHistory,
  tags: ["autodocs"],
  argTypes: {
    finishedAt: {
      control: "date",
    },
  },
} satisfies Meta<typeof RoundHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoTheme: Story = {
  args: {
    id: "id",
    finishedAt: "2023-01-03T11:12:13",
    averagePoint: 3.5,
  },
};

export const HasTheme: Story = {
  args: {
    id: "id",
    theme: "A theme",
    finishedAt: "2023-01-03T11:12:13",
    averagePoint: 3.5,
  },
};
