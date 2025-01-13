import { Game } from "@spp/shared-domain";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { GameListItem } from "./game-list-item.js";

afterEach(cleanup);

test("render component", () => {
  // Arrange
  const { hook } = memoryLocation();

  // Act
  render(
    <Router hook={hook}>
      <GameListItem gameId={Game.createId("id")} name="The game" />
    </Router>
  );

  // Assert
  expect(screen.queryByText("The game")).not.toBeNull();
  expect(screen.getByLabelText("mark").ariaSelected).toBe("false");
});

test("render for selected", () => {
  // Arrange
  const { hook } = memoryLocation();

  // Act
  render(
    <Router hook={hook}>
      <GameListItem gameId={Game.createId("id")} name="The game" selected />
    </Router>
  );

  // Assert
  expect(screen.queryByText("The game")).not.toBeNull();
  expect(screen.getByLabelText("mark").ariaSelected).toBe("true");
});

test("handle click", async () => {
  expect.assertions(1);
  // Arrange
  const { hook } = memoryLocation();

  // Act
  render(
    <Router hook={hook}>
      <GameListItem
        gameId={Game.createId("id")}
        name="The game"
        onClick={() => {
          expect(true).toBeTruthy();
        }}
      />
    </Router>
  );
  const button = screen.getByText("The game");
  await userEvent.click(button);
  // Assert
});

test("should not call callback if the game is selected", async () => {
  // Arrange
  const { hook } = memoryLocation();
  const onClick = Sinon.fake();
  const game = Game.createId("id");
  const gameListItem = <GameListItem gameId={game} name="The game" onClick={onClick} selected />;
  render(<Router hook={hook}>{gameListItem}</Router>);

  // Act
  await userEvent.click(screen.getByText("The game"));

  // Assert
  expect(onClick.calledOnce).toBeFalsy();
});
