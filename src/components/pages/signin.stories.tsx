import type { Meta, StoryObj } from "@storybook/react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { SignInPage } from "./signin";
import { createPureStore } from "@/status/store";

const meta = {
  title: "Page/Sign In",
  component: SignInPage,
  tags: ["autodocs"],
} satisfies Meta<typeof SignInPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  args: {
    method: "signIn",
  },
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <MemoryRouter>
          <SignInPage method="signIn" />
        </MemoryRouter>
      </Provider>
    );
  },
};

export const SignUp: Story = {
  args: {
    method: "signUp",
  },
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <MemoryRouter>
          <SignInPage method="signUp" />
        </MemoryRouter>
      </Provider>
    );
  },
};
