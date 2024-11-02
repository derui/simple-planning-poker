import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { Inspector } from "./inspector.js";
import { Inspectors } from "./inspectors.js";

const meta: Meta<typeof Inspectors> = {
  title: "Presentations/Inspectors",
  component: Inspectors,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const SomeInspector: Story = {
  args: {
    children: [<Inspector name="foobar" />, <Inspector name="long name" />],
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Inspectors {...args} />/
      </div>
    );
  },
};
