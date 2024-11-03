import type { Meta, StoryObj } from "@storybook/react";

import { User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { createUseCreateGame } from "../../atoms/create-game.js";
import { CreateGameStatus } from "../../atoms/type.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameCreator } from "./game-creator.js";

const meta: Meta<typeof GameCreator> = {
  title: "Page/Game Creator",
  component: GameCreator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const InitializeUser = function InitializeUser({ children }: { children: React.ReactNode }) {
  return children;
};

export const NormalBehavior: Story = {
  render() {
    const store = createStore();
    const repository = newMemoryGameRepository();
    const hooks: Hooks = {
      useListGames: sinon.fake(),
      useCreateGame: createUseCreateGame({
        gameRepository: repository,
        dispatcher: sinon.fake(),
        useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
      }),
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
      useListGames: sinon.fake(),
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
