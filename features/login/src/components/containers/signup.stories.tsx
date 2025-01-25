import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";

import { SignUp } from "./signup.js";

const meta: Meta<typeof SignUp> = {
  title: "Container/Sign Up",
  component: SignUp,
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
          <SignUp />
        </div>
      </Provider>
    );
  },
};
