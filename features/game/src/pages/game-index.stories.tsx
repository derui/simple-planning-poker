import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear as clearGame } from "@spp/shared-domain/mock/game-repository";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { useEffect } from "react";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { useCurrentGame } from "../atoms/use-current-game.js";
import { GameIndex } from "./game-index.js";

const meta: Meta<typeof GameIndex> = {
  title: "Page/Game Index",
  component: GameIndex,
  tags: ["autodocs"],
  beforeEach: async () => {
    clearGame();
    clearUser();

    await UserRepository.save({
      user: User.create({
        id: User.createId("foo"),
        name: "foo",
      }),
    });
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingPrepared: Story = {
  render() {
    const store = createStore();
    const { hook } = memoryLocation();

    return (
      <Router hook={hook}>
        <Provider store={store}>
          <div className={themeClass}>
            <GameIndex onStartVoting={() => {}} userId="foo" />
          </div>
        </Provider>
      </Router>
    );
  },
};

export const Empty: Story = {
  render() {
    const store = createStore();
    const { hook } = memoryLocation();

    useEffect(() => {
      useCurrentGame().select(Game.createId("game"));
    }, []);

    return (
      <Router hook={hook}>
        <Provider store={store}>
          <div className={themeClass}>
            <GameIndex onStartVoting={() => {}} userId="foo" />
          </div>
        </Provider>
      </Router>
    );
  },
};

export const SomeGames: Story = {
  render() {
    const store = createStore();
    const { hook } = memoryLocation();

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
      <Router hook={hook}>
        <Provider store={store}>
          <div className={themeClass}>
            <GameIndex onStartVoting={() => {}} userId="foo" />
          </div>
        </Provider>
      </Router>
    );
  },
};

export const TenGames: Story = {
  render() {
    const store = createStore();
    const games = new Array(10).fill(undefined);
    const { hook } = memoryLocation();

    useEffect(() => {
      games.forEach((_, idx) =>
        GameRepository.save({
          game: Game.create({
            id: Game.createId(),
            owner: User.createId("foo"),
            name: GameName.create(`Sprint ${idx}`),
            points: ApplicablePoints.create([StoryPoint.create(idx)]),
          })[0],
        })
      );
    }, []);

    return (
      <Router hook={hook}>
        <Provider store={store}>
          <div className={themeClass}>
            <GameIndex onStartVoting={() => {}} userId="foo" />
          </div>
        </Provider>
      </Router>
    );
  },
};
