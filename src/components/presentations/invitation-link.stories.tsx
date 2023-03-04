import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { InvitationLink } from "./invitation-link";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Invitation Link",
  component: InvitationLink,
  tags: ["autodocs"],
} satisfies Meta<typeof InvitationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    invitationLink: "https://link.to",
  },

  render(args) {
    return (
      <div className="w-full flex flex-col items-end">
        <InvitationLink {...args} />
      </div>
    );
  },
};
