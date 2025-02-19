import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { Dialog } from "./dialog.js";

const meta: {
  title: string;
  component: typeof Dialog;
  tags: string[];
} = {
  title: "Presentational/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    title: "sample",
  },
};

export const WithChildren: Story = {
  args: {
    title: "sample",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Dialog {...args}>
          <div className="w-full">inner object</div>
        </Dialog>
      </div>
    );
  },
};
