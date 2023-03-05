import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { SignInPage } from "./signin";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";

install(twind);

const meta = {
  title: "Page/Sign In",
  component: SignInPage,
  tags: ["autodocs"],
} satisfies Meta<typeof SignInPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <SignInPage />
      </Provider>
    );
  },
};
