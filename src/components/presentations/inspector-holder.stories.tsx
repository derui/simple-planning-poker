import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { InspectorHolder } from "./inspector-holder";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Card Holder for Inspector",
  component: InspectorHolder,
  tags: ["autodocs"],
} satisfies Meta<typeof InspectorHolder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
