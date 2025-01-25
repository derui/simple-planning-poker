import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { LoginForm } from "./login-form.js";

const meta: Meta<typeof LoginForm> = {
  title: "Presentations/Login Form",
  component: LoginForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {
  args: {},
  render() {
    return (
      <div className={themeClass}>
        <LoginForm />
      </div>
    );
  },
};
