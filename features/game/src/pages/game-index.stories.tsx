import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import { hooks, ImplementationProvider } from "../hooks/facade.js";
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

    useEffect(() => {
      [
        Game.create({
          id: Game.createId(),
          owner: User.createId("foo"),
          name: GameName.create("Sprint 1"),
          points: ApplicablePoints.create([StoryPoint.create(1)]),
        })[0],

        Game.create({
          id: Game.createId(),
          owner: User.createId("bar"),
          name: GameName.create("Sprint 2"),
          points: ApplicablePoints.create([StoryPoint.create(1)]),
        })[0],
      ].forEach((game) => GameRepository.save({ game }));
    }, []);

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
    useEffect(() => {
      games.forEach((game) =>
        GameRepository.save({
          game: Game.create({
            id: Game.createId(),
            owner: User.createId("foo"),
            name: GameName.create("Sprint 1"),
            points: ApplicablePoints.create([StoryPoint.create(1)]),
          })[0],
        })
      );
    }, []);

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
