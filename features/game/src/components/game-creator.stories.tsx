import type { Meta, StoryObj } from "@storybook/react";

import { MemoryRouter } from "react-router-dom";
import { GameCreator } from "./game-creator.js";
import { createStore, Provider } from "jotai";
import { hooks, Hooks, ImplementationProvider } from "../hooks/facade.js";
import { CreateGameStatus, createUseCreateGame } from "../atoms/game.js";
import sinon from "sinon";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { useEffect } from "react";
import { User } from "@spp/shared-domain";

const meta = {
  title: "Page/Game Creator",
  component: GameCreator,
  tags: ["autodocs"],
} satisfies Meta<typeof GameCreator>;

export default meta;
type Story = StoryObj<typeof meta>;

const InitializeUser = function InitializeUser({ children }: { children: React.ReactNode }) {
  const createGame = hooks.useCreateGame();

  useEffect(() => {
    createGame.prepare(User.createId());
  }, []);

  return children;
};

export const NormalBehavior: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame: createUseCreateGame(newMemoryGameRepository(), sinon.fake()),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <InitializeUser>
              <GameCreator />
            </InitializeUser>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const Preparing: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame() {
        return {
          status: CreateGameStatus.Preparing,
          canCreate: sinon.fake.returns([]),
          create: sinon.fake(),
          prepare: sinon.fake(),
        };
      },
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <GameCreator />
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const Waiting: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame() {
        return {
          status: CreateGameStatus.Waiting,
          canCreate: sinon.fake.returns([]),
          create: sinon.fake(),
          prepare: sinon.fake(),
        };
      },
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <GameCreator />
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};
