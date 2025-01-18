import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
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
    const store = createStore();
    const { hook } = memoryLocation();

    return (
      <Router hook={hook}>
        <Provider store={store}>
          <div className={themeClass}>
            <LoginPage onLogined={sinon.fake()} />
          </div>
        </Provider>
      </Router>
    );
  },
};
