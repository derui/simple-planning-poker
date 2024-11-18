import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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

// add test case to check a handler called or not
test("should call the handler when the game is loaded", async () => {
  expect.assertions(1);
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame: sinon.fake(),
    useListGames() {
      return {
        loading: "completed",
        games: [
          {
            id: "id",
            name: "The game",
            owned: true,
          },
        ],
        startVoting: (id) => {
          expect(id).toEqual("id");
        },
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

  await userEvent.click(await screen.findByText("The game"));

  // Assert
});
