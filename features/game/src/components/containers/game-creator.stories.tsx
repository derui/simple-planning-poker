import type { Meta, StoryObj } from "@storybook/react";

import { User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { CreateGameStatus, createUseCreateGame, createUsePrepareGame } from "../../atoms/game.js";
import { hooks, Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameCreator } from "./game-creator.js";

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
      useListGame: sinon.fake(),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <InitializeUser>
              <div className={themeClass}>
                <GameCreator />
              </div>
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
      useListGame: sinon.fake(),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <div className={themeClass}>
              <GameCreator />
            </div>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};
