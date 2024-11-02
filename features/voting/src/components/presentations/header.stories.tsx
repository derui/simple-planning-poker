import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { Header } from "./header.js";

const meta: Meta<typeof Header> = {
  title: "Presentations/Header",
  component: Header,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: "theme",
    defaultRole: "player",
  },
};

export const Inspector: Story = {
  args: {
    theme: "theme",
    defaultRole: "inspector",
  },
  render(args) {
    return (
      <div className={themeClass}>
        <Header {...args} />
      </div>
    );
  },
};
