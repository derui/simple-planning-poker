import type { Meta, StoryObj } from "@storybook/react";

import { MemoryRouter } from "react-router-dom";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { Login } from "./login.js";
import { AuthStatus } from "../atoms/atom.js";

const meta = {
  title: "Page/Login",
  component: Login,
  tags: ["autodocs"],
} satisfies Meta<typeof Login>;

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
          <MemoryRouter>
            <Login />
          </MemoryRouter>
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
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};
