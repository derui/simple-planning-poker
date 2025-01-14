import type { Meta, StoryObj } from "@storybook/react";

import { User } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import React, { useEffect } from "react";
import { UserHeader } from "./user-header.js";

const meta: Meta<typeof UserHeader> = {
  title: "Container/User Header",
  component: UserHeader,
  tags: ["autodocs"],
  beforeEach: async () => {
    clear();

    await UserRepository.save({
        user: User.create({
          id: User.createId("foo"),
          name: "foobar",
        }),
      })
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingPrepared: Story = {
  render() {
    const store = createStore();

    return (
      <Provider store={store}>
        <div className={themeClass}>
          <UserHeader />
        </div>
      </Provider>
    );
  },
};

const Login = () => {
  useEffect(() => {
    UserRepository.loadUser("foo");
  }, []);

  return <UserHeader />;
};

export const Loaded: Story = {
  render() {
    const store = createStore();

    return (
      <Provider store={store}>
        <div className={themeClass}>
          <Login />
        </div>
      </Provider>
    );
  },
};
