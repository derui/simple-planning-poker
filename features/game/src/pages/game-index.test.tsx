import { ApplicablePoints, Game, GameName, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear as clearGame } from "@spp/shared-domain/mock/game-repository";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { afterEach, beforeEach, expect, test } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { GameIndex } from "./game-index.js";

afterEach(cleanup);
beforeEach(clearGame);
beforeEach(clearUser);

test("render page", async () => {
  // Arrange
  const store = createStore();
  const { hook } = memoryLocation();

  await UserRepository.save({
    user: User.create({
      id: User.createId("user"),
      name: "user",
    }),
  });

  // Act
  render(
    <Router hook={hook}>
      <Provider store={store}>
        <GameIndex userId="user" onStartVoting={() => {}} />
      </Provider>
    </Router>
  );

  // Assert
  expect(screen.queryByText(/Select game from list/)).not.toBeNull();
  expect(screen.queryByText("Add Game")).not.toBeNull();
});

test("should load games after loaded", async () => {
  // Arrange
  const store = createStore();
  const { hook } = memoryLocation();

  await GameRepository.save({
    game: Game.create({
      id: Game.createId(),
      name: GameName.create("The game"),
      owner: User.createId("user"),
      points: ApplicablePoints.parse("1,2,3")!,
    })[0],
  });

  await UserRepository.save({
    user: User.create({
      id: User.createId("user"),
      name: "user",
    }),
  });

  // Act
  render(
    <Router hook={hook}>
      <Provider store={store}>
        <GameIndex userId="user" onStartVoting={() => {}} />
      </Provider>
    </Router>
  );

  await userEvent.click(await screen.findByText("The game"));

  // Assert
  expect(screen.queryAllByText("The game")).toHaveLength(2);
});
