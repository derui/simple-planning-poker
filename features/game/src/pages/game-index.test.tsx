import { ApplicablePoints, Game, GameName, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { afterEach, expect, test } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { loadGamesAtom } from "../atoms/game-atom.js";
import { GameIndex } from "./game-index.js";

afterEach(cleanup);

test("render page", () => {
  // Arrange
  const store = createStore();
  const { hook } = memoryLocation();

  // Act
  render(
    <Router hook={hook}>
      <Provider store={store}>
        <GameIndex onStartVoting={() => {}} />
      </Provider>
    </Router>
  );

  // Assert
  expect(screen.queryByText(/Select game from list/)).not.toBeNull();
  expect(screen.queryByText("Add Game")).not.toBeNull();
});

// add test case to check a handler called or not
test("should call the handler when the game is loaded", async () => {
  expect.assertions(1);
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
  store.set(loadGamesAtom, User.createId("user"));

  // Act
  render(
    <Router hook={hook}>
      <Provider store={store}>
        <GameIndex onStartVoting={() => {}} />
      </Provider>
    </Router>
  );

  await userEvent.click(await screen.findByText("The game"));

  // Assert
  expect(screen.queryAllByText("The game")).toHaveLength(2);
});
