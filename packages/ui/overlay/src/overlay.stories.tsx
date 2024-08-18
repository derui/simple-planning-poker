import type { Meta, StoryObj } from "@storybook/react";

import { Overlay } from "./overlay";

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
