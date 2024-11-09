import type { Meta, StoryObj } from "@storybook/react";

import { User } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newChangeUserNameUseCase } from "@spp/shared-use-case";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { createUseUserHeader } from "../../atoms/user-header.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameIndex } from "./game-index.js";
import { UserHeader } from "./user-header.js";

const meta: Meta<typeof GameIndex> = {
  title: "Container/User Header",
  component: UserHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingPrepared: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      useListGames: sinon.fake(),
      useUserHeader: createUseUserHeader({
        useLoginUser: () => ({ userId: User.createId("foo") }),
        userRepository: newMemoryUserRepository(),
        changeUserNameUseCase: sinon.fake(),
      }),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <div className={themeClass}>
              <UserHeader />
            </div>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};
export const Loaded: Story = {
  render() {
    const store = createStore();
    const userRepository = newMemoryUserRepository([
      User.create({
        id: User.createId("foo"),
        name: "foobar",
      }),
    ]);
    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      useListGames: sinon.fake(),
      useUserHeader: createUseUserHeader({
        useLoginUser: () => ({ userId: User.createId("foo") }),
        userRepository,
        changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), userRepository),
      }),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <div className={themeClass}>
              <UserHeader />
            </div>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};
