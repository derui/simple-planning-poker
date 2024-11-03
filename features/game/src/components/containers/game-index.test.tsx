import { cleanup, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameIndex } from "./game-index.js";

afterEach(cleanup);

test("render page", () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame: sinon.fake(),
    useListGames() {
      return {
        loading: "completed",
        games: [],
        startVoting: sinon.fake(),
      };
    },
  };

  // Act
  render(
    <ImplementationProvider implementation={hooks}>
      <Provider store={store}>
        <MemoryRouter>
          <GameIndex />
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  // Assert
  expect(screen.queryByText(/You do not have/)).not.toBeNull();
  expect(screen.queryByText("New Game")).not.toBeNull();
});

test("show loading while preparing", () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame: sinon.fake(),
    useListGames() {
      return {
        loading: "loading",
        games: [],
        startVoting: sinon.fake(),
      };
    },
  };

  // Act
  render(
    <ImplementationProvider implementation={hooks}>
      <Provider store={store}>
        <MemoryRouter>
          <GameIndex />
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  // Assert
  expect(screen.queryByText(/Loading/)).not.toBeNull();
  expect(screen.queryByText("New Game")).toBeNull();
});
