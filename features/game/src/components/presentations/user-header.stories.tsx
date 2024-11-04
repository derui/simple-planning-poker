import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { VoterMode } from "../type.js";
import { UserHeader } from "./user-header.js";

const meta: Meta<typeof UserHeader> = {
  title: "Presentations/User Header",
  component: UserHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    userName: "normal",
    defaultVoterMode: VoterMode.Normal,
  },
  render(args) {
    return (
      <div className={themeClass}>
        <UserHeader {...args} />
      </div>
    );
  },
};
