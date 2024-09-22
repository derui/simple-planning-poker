import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { GameListItem } from "./game-list-item.js";
import { Game } from "@spp/shared-domain";
import { MemoryRouter } from "react-router-dom";

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
  expect(screen.getByText("Owner").classList.values()).toContain("invisible");
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
  expect(screen.getByText("Owner").classList.values()).not.toContain("invisible");
});
