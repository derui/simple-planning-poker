import { Game } from "@spp/shared-domain";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { GameListItem } from "./game-list-item.js";

afterEach(cleanup);

test("render component", () => {
  // Arrange

  // Act
  render(
    <MemoryRouter>
      <GameListItem gameId={Game.createId("id")} name="The game" />
    </MemoryRouter>
  );

  // Assert
  expect(screen.queryByText("The game")).not.toBeNull();
  expect(screen.getByLabelText("mark").ariaSelected).toBe("false");
});

test("render for selected", () => {
  // Arrange

  // Act
  render(
    <MemoryRouter>
      <GameListItem gameId={Game.createId("id")} name="The game" selected />
    </MemoryRouter>
  );

  // Assert
  expect(screen.queryByText("The game")).not.toBeNull();
  expect(screen.getByLabelText("mark").ariaSelected).toBe("true");
});

test("handle click", async () => {
  expect.assertions(1);
  // Arrange

  // Act
  render(
    <MemoryRouter>
      <GameListItem
        gameId={Game.createId("id")}
        name="The game"
        onClick={() => {
          expect(true).toBeTruthy();
        }}
      />
    </MemoryRouter>
  );
  const button = screen.getByText("The game");
  await userEvent.click(button);
  // Assert
});

test("should not call callback if the game is selected", async () => {
  // Arrange
  const onClick = Sinon.fake();
  const game = Game.createId("id");
  const gameListItem = <GameListItem gameId={game} name="The game" onClick={onClick} selected />;
  render(<MemoryRouter>{gameListItem}</MemoryRouter>);

  // Act
  await userEvent.click(screen.getByText("The game"));

  // Assert
  expect(onClick.calledOnce).toBeFalsy;
});
