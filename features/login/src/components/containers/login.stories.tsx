import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { AuthStatus } from "../../atoms/use-auth.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
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
    const mock: Hooks = {
      useLogin: sinon.fake(),
      useAuth() {
        return {
          status: AuthStatus.Authenticated,
          checkLogined: sinon.fake(),
          logout: sinon.fake(),
        };
      },
    };
    const store = createStore();

    return (
      <ImplementationProvider implementation={mock}>
        <Provider store={store}>
          <div className={themeClass}>
            <Login />
          </div>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const checking: Story = {
  render() {
    const mock: Hooks = {
      useLogin: sinon.fake(),
      useAuth() {
        return {
          status: AuthStatus.Checking,
          checkLogined: sinon.fake(),
          logout: sinon.fake(),
        };
      },
    };
    const store = createStore();

    return (
      <ImplementationProvider implementation={mock}>
        <Provider store={store}>
          <div className={themeClass}>
            <Login />
          </div>
        </Provider>
      </ImplementationProvider>
    );
  },
};
