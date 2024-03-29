import type { Meta, StoryObj } from "@storybook/react";

import { InvitationToken } from "./invitation-token";

const meta = {
  title: "Presentational/Invitation Token",
  component: InvitationToken,
  tags: ["autodocs"],
} satisfies Meta<typeof InvitationToken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    invitationToken: "token",
  },

  render(args) {
    return (
      <div className="w-full flex flex-col items-center">
        <InvitationToken {...args} />
      </div>
    );
  },
};
