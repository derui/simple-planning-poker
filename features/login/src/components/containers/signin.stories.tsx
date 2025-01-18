import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { SignIn } from "./signin.js";

const meta: Meta<typeof SignIn> = {
  title: "Container/Sign In",
  component: SignIn,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const notLogin: Story = {
  render() {
    return (
      <Provider>
        <div className={themeClass}>
          <SignIn />
        </div>
      </Provider>
    );
  },
};

export const doing: Story = {
  render() {
    const store = createStore();

    return (
      <Provider store={store}>
        <div className={themeClass}>
          <SignIn />
        </div>
      </Provider>
    );
  },
};
