import type { Meta, StoryObj } from "@storybook/react";
import { JoinedUserList } from "./joined-user-list";
import { createId } from "@/domains/user";

const meta = {
  title: "Presentational/Joined User List",
  component: JoinedUserList,
  tags: ["autodocs"],
} satisfies Meta<typeof JoinedUserList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unkickable: Story = {
  args: {
    users: [
      { name: "user a", id: createId("user") },
      { name: "user b", id: createId("user2") },
    ],
  },

  render(args) {
    return (
      <div className="w-full flex flex-col items-center">
        <JoinedUserList {...args} />
      </div>
    );
  },
};

export const Kickable: Story = {
  args: {
    users: [
      { name: "user a", id: createId("user") },
      { name: "user b", id: createId("user2") },
    ],
    onKick: () => {},
  },

  render(args) {
    return (
      <div className="w-full flex flex-col items-center">
        <JoinedUserList {...args} />
      </div>
    );
  },
};
