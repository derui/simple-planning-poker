import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";

import { Login } from "./login.js";

const meta: Meta<typeof Login> = {
  title: "Container/Login",
  component: Login,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const notLogin: Story = {
  render() {
    const store = createStore();

    return (
      <Provider store={store}>
        <div className={themeClass}>
          <Login />
        </div>
      </Provider>
    );
  },
};
