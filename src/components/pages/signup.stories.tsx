import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { SignUpPage } from "./signup";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";

install(twind);

const meta = {
  title: "Page/Sign Up",
  component: SignUpPage,
  tags: ["autodocs"],
} satisfies Meta<typeof SignUpPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <SignUpPage />
      </Provider>
    );
  },
};
