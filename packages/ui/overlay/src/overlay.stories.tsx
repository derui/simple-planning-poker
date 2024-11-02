import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { Overlay } from "./overlay.js";

const meta: Meta<typeof Overlay> = {
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
      <div className={themeClass}>
        <Overlay {...args} />
        <button className="rounded border" onClick={console.log}>
          name
        </button>
      </div>
    );
  },
};

export const WithChildren: Story = {
  args: {
    show: true,
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Overlay {...args}>
          <div>content centric</div>
        </Overlay>
      </div>
    );
  },
};
