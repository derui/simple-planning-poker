import type { Meta, StoryObj } from "@storybook/react";

import { Inspectors } from "./inspectors.js";
import { Inspector } from "./inspector.js";

const meta = {
  title: "Presentations/Inspectors",
  component: Inspectors,
  tags: ["autodocs"],
} satisfies Meta<typeof Inspectors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const SomeInspector: Story = {
  args: {
    children: [<Inspector name="foobar" />, <Inspector name="long name" />],
  },
};
