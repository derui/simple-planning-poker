import { Game } from "@spp/shared-domain";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, test } from "vitest";
import { ownerMarkInvisible } from "./game-list-item.css.js";
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
  expect(screen.getByText("Owner").classList.values()).not.toContain(ownerMarkInvisible);
});

test("render for owner", () => {
  // Arrange

  // Act
  render(
    <MemoryRouter>
      <GameListItem gameId={Game.createId("id")} name="The game" owned />
    </MemoryRouter>
  );

  // Assert
  expect(screen.queryByText("The game")).not.toBeNull();
  expect(screen.getByText("Owner").classList.values()).not.toContain(ownerMarkInvisible);
});
