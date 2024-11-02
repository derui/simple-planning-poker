import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { createUseListGame, createUsePrepareGame } from "../../atoms/game.js";
import { hooks, Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameIndex } from "./game-index.js";

const meta: Meta<typeof GameIndex> = {
  title: "Page/Game Index",
  component: GameIndex,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const InitializeUser = function InitializeUser({ children }: { children: React.ReactNode }) {
  const { prepare } = hooks.usePrepareGame();

  useEffect(() => {
    prepare();
  }, []);

  return children;
};

export const WaitingPrepared: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      usePrepareGame: createUsePrepareGame({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
      }),
      useListGame: createUseListGame(() => ({ userId: User.createId("foo") })),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <div className={themeClass}>
              <GameIndex />
            </div>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const Empty: Story = {
  render() {
    const store = createStore();
    const repository = newMemoryGameRepository();

    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      usePrepareGame: createUsePrepareGame({
        gameRepository: repository,
        useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
      }),
      useListGame: createUseListGame(() => ({ userId: User.createId("foo") })),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <InitializeUser>
              <div className={themeClass}>
                <GameIndex />
              </div>
            </InitializeUser>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const SomeGames: Story = {
  render() {
    const store = createStore();
    const repository = newMemoryGameRepository([
      Game.create({
        id: Game.createId(),
        owner: User.createId("foo"),
        name: "Sprint 1",
        points: ApplicablePoints.create([StoryPoint.create(1)]),
      })[0],

      Game.create({
        id: Game.createId(),
        owner: User.createId("bar"),
        name: "Sprint 2",
        points: ApplicablePoints.create([StoryPoint.create(1)]),
      })[0],
    ]);

    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      usePrepareGame: createUsePrepareGame({
        gameRepository: repository,
        useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
      }),
      useListGame: createUseListGame(() => ({ userId: User.createId("foo") })),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <InitializeUser>
              <div className={themeClass}>
                <GameIndex />
              </div>
            </InitializeUser>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const TenGames: Story = {
  render() {
    const store = createStore();
    const games = new Array(10).fill(undefined);

    const repository = newMemoryGameRepository(
      games.map(
        () =>
          Game.create({
            id: Game.createId(),
            owner: User.createId("foo"),
            name: "Sprint 1",
            points: ApplicablePoints.create([StoryPoint.create(1)]),
          })[0]
      )
    );

    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      usePrepareGame: createUsePrepareGame({
        gameRepository: repository,
        useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
      }),
      useListGame: createUseListGame(() => ({ userId: User.createId("foo") })),
    };

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <MemoryRouter>
            <InitializeUser>
              <div className={themeClass}>
                <GameIndex />
              </div>
            </InitializeUser>
          </MemoryRouter>
        </Provider>
      </ImplementationProvider>
    );
  },
};
