import type { Meta, StoryObj } from "@storybook/react";

import { InspectorHolder } from "./inspector-holder";

const meta = {
  title: "Presentational/Card Holder for Inspector",
  component: InspectorHolder,
  tags: ["autodocs"],
} satisfies Meta<typeof InspectorHolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
