import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { UserNameEditor } from "./user-name-editor.js";

const meta: Meta<typeof UserNameEditor> = {
  title: "Presentations/User Name Editor",
  component: UserNameEditor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    return (
      <div className={themeClass}>
        <UserNameEditor defaultValue="name" />
      </div>
    );
  },
};
