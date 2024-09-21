import type { Meta, StoryObj } from "@storybook/react";

import { MemoryRouter } from "react-router-dom";
import { SignUp } from "./signup.js";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import { createStore, Provider } from "jotai";
import sinon from "sinon";

const meta = {
  title: "Page/Sign In",
  component: SignUp,
  tags: ["autodocs"],
} satisfies Meta<typeof SignUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const notLogin: Story = {
  render() {
    const mock: Hooks = {
      useLogin() {
        return {
          loginError: undefined,
          status: "notLogined",
          signIn() {},
          signUp() {},
        };
      },
      useAuth: sinon.fake(),
    };
    const store = createStore();

    return (
      <ImplementationProvider implementation={mock}>
        <Provider store={store}>
          <MemoryRouter>
            <SignUp />
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const doing: Story = {
  render() {
    const mock: Hooks = {
      useLogin() {
        return {
          loginError: undefined,
          status: "doing",
          signIn() {},
          signUp() {},
        };
      },
      useAuth: sinon.fake(),
    };
    const store = createStore();

    return (
      <ImplementationProvider implementation={mock}>
        <Provider store={store}>
          <MemoryRouter>
            <SignUp />
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};
