import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";

import sinon from "sinon";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
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
          <div className={themeClass}>
            <SignUp />
          </div>
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
          <div className={themeClass}>
            <SignUp />
          </div>
        </Provider>
      </ImplementationProvider>
    );
  },
};
