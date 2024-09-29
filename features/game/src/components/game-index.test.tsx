import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { GameIndex } from "./game-index.js";
import sinon from "sinon";
import { createStore, Provider } from "jotai";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import { PrepareGameStatus } from "../atoms/game.js";

afterEach(cleanup);

test("render page", () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame: sinon.fake(),
    usePrepareGame() {
      return {
        status: PrepareGameStatus.Prepared,
        prepare: sinon.fake(),
      };
    },
    useListGame() {
      return {
        games: [],
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
  expect(screen.queryByText("Create Game")).not.toBeNull();
});

test("show loading while preparing", () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame: sinon.fake(),
    usePrepareGame() {
      return {
        status: PrepareGameStatus.Preparing,
        prepare: sinon.fake(),
      };
    },
    useListGame() {
      return {
        games: [],
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
  expect(screen.queryByText("Create Game")).toBeNull();
});

test("disable join button when token is empty", async () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame: sinon.fake(),
    usePrepareGame() {
      return {
        status: PrepareGameStatus.Prepared,
        prepare: sinon.fake(),
      };
    },
    useListGame() {
      return {
        games: [],
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
  expect(screen.getByText("Join")).toHaveProperty("disabled", true);
});

test("enable join button after type invitation", async () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame: sinon.fake(),
    usePrepareGame() {
      return {
        status: PrepareGameStatus.Prepared,
        prepare: sinon.fake(),
      };
    },
    useListGame() {
      return {
        games: [],
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

  await userEvent.type(screen.getByPlaceholderText(/invitation/i), "1234");

  // Assert
  expect(screen.getByText("Join")).toHaveProperty("disabled", false);
});
