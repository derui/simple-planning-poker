import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Overlay } from "./overlay";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Overlay",
  component: Overlay,
  tags: ["autodocs"],
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Show: Story = {
  args: {
    show: true,
  },
  render(args) {
    return (
      <>
        <Overlay {...args} />
        <button className="rounded border" onClick={console.log}>
          name
        </button>
      </>
    );
  },
};

export const WithChildren: Story = {
  args: {
    show: true,
  },
  render(args) {
    return (
      <Overlay {...args}>
        <div>content centric</div>
      </Overlay>
    );
  },
};
