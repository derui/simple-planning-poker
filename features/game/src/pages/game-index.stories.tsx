import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Game, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { newChangeDefaultVoterTypeUseCase, newChangeUserNameUseCase, newDeleteGameUseCase } from "@spp/shared-use-case";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { createUseCreateGame } from "../atoms/create-game.js";
import { createUseGameDetail } from "../atoms/game-detail.js";
import { createUseGameIndex } from "../atoms/game-index.js";
import { createUseListGames } from "../atoms/list-games.js";
import { createUseUserHeader } from "../atoms/user-header.js";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import { GameIndex } from "./game-index.js";

const meta: Meta<typeof GameIndex> = {
  title: "Page/Game Index",
  component: GameIndex,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const InitializeUser = function InitializeUser({ children }: { children: React.ReactNode }) {
  return children;
};

export const WaitingPrepared: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame: createUseCreateGame({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        dispatcher: sinon.fake(),
      }),
      useListGames: createUseListGames({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
      }),
      useGameDetail: createUseGameDetail({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        deleteGameUseCase: newDeleteGameUseCase(newMemoryGameRepository()),
      }),
      useUserHeader: createUseUserHeader({
        userRepository: newMemoryUserRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), newMemoryUserRepository()),
        changeDefaultVoterModeUseCase: newChangeDefaultVoterTypeUseCase(newMemoryUserRepository()),
      }),
      useGameIndex: createUseGameIndex(),
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
      useCreateGame: createUseCreateGame({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        dispatcher: sinon.fake(),
      }),
      useListGames: createUseListGames({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
      }),
      useGameDetail: createUseGameDetail({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        deleteGameUseCase: newDeleteGameUseCase(repositry),
      }),
      useUserHeader: createUseUserHeader({
        userRepository: newMemoryUserRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), newMemoryUserRepository()),
        changeDefaultVoterModeUseCase: newChangeDefaultVoterTypeUseCase(newMemoryUserRepository()),
      }),
      useGameIndex: createUseGameIndex(),
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
      useCreateGame: createUseCreateGame({
        gameRepository: repository,
        useLoginUser: () => ({ userId: User.createId("foo") }),
        dispatcher: sinon.fake(),
      }),
      useListGames: createUseListGames({
        gameRepository: repository,
        useLoginUser: () => ({ userId: User.createId("foo") }),
      }),
      useGameDetail: createUseGameDetail({
        gameRepository: repository,
        useLoginUser: () => ({ userId: User.createId("foo") }),
        deleteGameUseCase: newDeleteGameUseCase(repository),
      }),
      useUserHeader: createUseUserHeader({
        userRepository: newMemoryUserRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), newMemoryUserRepository()),
        changeDefaultVoterModeUseCase: newChangeDefaultVoterTypeUseCase(newMemoryUserRepository()),
      }),
      useGameIndex: createUseGameIndex(),
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
      useCreateGame: createUseCreateGame({
        gameRepository: repository,
        useLoginUser: () => ({ userId: User.createId("foo") }),
        dispatcher: sinon.fake(),
      }),
      useListGames: createUseListGames({
        gameRepository: repository,
        useLoginUser: () => ({ userId: User.createId("foo") }),
      }),
      useGameDetail: createUseGameDetail({
        gameRepository: repository,
        useLoginUser: () => ({ userId: User.createId("foo") }),
        deleteGameUseCase: newDeleteGameUseCase(repository),
      }),
      useUserHeader: createUseUserHeader({
        userRepository: newMemoryUserRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        changeUserNameUseCase: newChangeUserNameUseCase(sinon.fake(), newMemoryUserRepository()),
        changeDefaultVoterModeUseCase: newChangeDefaultVoterTypeUseCase(newMemoryUserRepository()),
      }),
      useGameIndex: createUseGameIndex(),
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
