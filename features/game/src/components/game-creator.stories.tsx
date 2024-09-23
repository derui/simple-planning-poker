import type { Meta, StoryObj } from "@storybook/react";

import { MemoryRouter } from "react-router-dom";
import { GameCreator } from "./game-creator.js";
import { createStore, Provider } from "jotai";
import { hooks, Hooks, ImplementationProvider } from "../hooks/facade.js";
import { CreateGameStatus, createUseCreateGame, createUsePrepareGame } from "../atoms/game.js";
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
  const { prepare } = hooks.usePrepareGame();

  useEffect(() => {
    prepare(User.createId());
  }, []);

  return children;
};

export const NormalBehavior: Story = {
  render() {
    const store = createStore();
    const repository = newMemoryGameRepository();
    const hooks: Hooks = {
      useCreateGame: createUseCreateGame(repository, sinon.fake()),
      usePrepareGame: createUsePrepareGame(repository),
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

export const Waiting: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame() {
        return {
          status: CreateGameStatus.Waiting,
          errors: [],
          validate: sinon.fake.returns([]),
          create: sinon.fake(),
        };
      },
      usePrepareGame: sinon.fake(),
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
