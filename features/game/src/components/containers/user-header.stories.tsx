import type { Meta, StoryObj } from "@storybook/react";

import { useLoginUser } from "@spp/feature-login";
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
  beforeEach: () => {
    clear();
  },
};

const Logined = ({ children }: React.PropsWithChildren) => {
  const { loginUser } = useLoginUser();

  useEffect(() => {
    loginUser(User.createId("foo"));
  }, []);

  return children;
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
export const Loaded: Story = {
  render() {
    const store = createStore();

    useEffect(() => {
      UserRepository.save({
        user: User.create({
          id: User.createId("foo"),
          name: "foobar",
        }),
      });
    }, []);

    return (
      <Provider store={store}>
        <Logined>
          <div className={themeClass}>
            <UserHeader />
          </div>
        </Logined>
      </Provider>
    );
  },
};
