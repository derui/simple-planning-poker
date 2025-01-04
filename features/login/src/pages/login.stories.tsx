import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { AuthStatus } from "../atoms/type.js";
import { useAuth } from "../atoms/use-auth.js";
import { useLogin } from "../atoms/use-login.js";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import { LoginPage } from "./login.js";

const meta: Meta<typeof LoginPage> = {
  title: "Page/LoginPage",
  component: LoginPage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const notLogin: Story = {
  render() {
    const mock: Hooks = {
      useLogin,
      useAuth,
    };
    const store = createStore();
    const { hook } = memoryLocation();

    return (
      <Router hook={hook}>
        <ImplementationProvider implementation={mock}>
          <Provider store={store}>
            <div className={themeClass}>
              <LoginPage onLogined={sinon.fake()} />
            </div>
          </Provider>
        </ImplementationProvider>
      </Router>
    );
  },
};

export const Checking: Story = {
  render() {
    const mock: Hooks = {
      useLogin,
      useAuth() {
        return {
          status: AuthStatus.Checking,
          checkLogined: sinon.fake(),
          logout: sinon.fake(),
        };
      },
    };
    const store = createStore();
    const { hook } = memoryLocation();

    return (
      <Router hook={hook}>
        <ImplementationProvider implementation={mock}>
          <Provider store={store}>
            <div className={themeClass}>
              <LoginPage onLogined={sinon.fake()} />
            </div>
          </Provider>
        </ImplementationProvider>
      </Router>
    );
  },
};
