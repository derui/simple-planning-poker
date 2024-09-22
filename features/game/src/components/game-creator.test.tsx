import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GameCreator } from "./game-creator.js";
import { Provider, createStore } from "jotai";
import { hooks, Hooks, ImplementationProvider } from "../hooks/facade.js";
import { CreateGameStatus, createUseCreateGame } from "../atoms/game.js";
import sinon from "sinon";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { PropsWithChildren, useEffect } from "react";
import { User } from "@spp/shared-domain";

afterEach(cleanup);

test("render page", () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame() {
      return {
        status: CreateGameStatus.Prepared,
        canCreate: sinon.fake(),
        create: sinon.fake(),
        prepare: sinon.fake(),
      };
    },
  };

  // Act
  render(
    <ImplementationProvider implementation={hooks}>
      <Provider store={store}>
        <MemoryRouter>
          <GameCreator />
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  // Assert
  expect(screen.getByLabelText("Name")).toHaveProperty("value", "");
  expect(screen.getByLabelText("Points")).toHaveProperty("value", "1,2,3,5,8,13,21,34,55,89");
  expect(screen.getByText("Submit")).toHaveProperty("disabled", false);
  expect(screen.getByText("Cancel")).toHaveProperty("disabled", false);
});

test("call hook after submit", async () => {
  // Arrange
  const store = createStore();

  const createFake = sinon.fake();
  const mock: Hooks = {
    useCreateGame() {
      return {
        status: CreateGameStatus.Prepared,
        create: createFake,
        canCreate: sinon.fake.returns([]),
        prepare: sinon.fake(),
      };
    },
  };

  render(
    <ImplementationProvider implementation={mock}>
      <Provider store={store}>
        <MemoryRouter>
          <GameCreator />
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  // Act
  await userEvent.type(screen.getByLabelText("Name"), "test");
  await userEvent.click(screen.getByText("Submit"));

  // Assert
  expect(createFake.calledOnce).toBeTruthy();
  expect(createFake.lastCall.args).toEqual(["test", "1,2,3,5,8,13,21,34,55,89"]);
});

test("disable submit if loading", async () => {
  // Arrange
  const store = createStore();

  const mock: Hooks = {
    useCreateGame() {
      return {
        status: CreateGameStatus.Preparing,
        create: sinon.fake(),
        canCreate: sinon.fake.returns([]),
        prepare: sinon.fake(),
      };
    },
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <Provider store={store}>
        <MemoryRouter>
          <GameCreator />
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  // Assert
  expect(screen.getByRole("button", { busy: true })).toBeTruthy();
  expect(screen.getByRole("button", { busy: true }).textContent).toEqual("");
  expect(screen.getByLabelText("Name")).toHaveProperty("disabled", true);
  expect(screen.getByLabelText("Points")).toHaveProperty("disabled", true);
});

test("show error if name is invalid", async () => {
  // Arrange
  const store = createStore();

  const mock: Hooks = {
    useCreateGame: createUseCreateGame(newMemoryGameRepository(), sinon.fake()),
  };

  const Wrapper = ({ children }: PropsWithChildren) => {
    const useCreateGame = hooks.useCreateGame();

    useEffect(() => {
      useCreateGame.prepare(User.createId());
    }, []);

    return children;
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <Provider store={store}>
        <MemoryRouter>
          <Wrapper>
            <GameCreator />
          </Wrapper>
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  await screen.findByText("Submit");
  await userEvent.click(screen.getByText("Submit"));

  // Assert
  expect(screen.queryByText("Invalid name")).not.toBeNull();
});

test("show error if points is invalid", async () => {
  // Arrange
  const store = createStore();

  const mock: Hooks = {
    useCreateGame: createUseCreateGame(newMemoryGameRepository(), sinon.fake()),
  };

  const Wrapper = ({ children }: PropsWithChildren) => {
    const useCreateGame = hooks.useCreateGame();

    useEffect(() => {
      useCreateGame.prepare(User.createId());
    }, []);

    return children;
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <Provider store={store}>
        <MemoryRouter>
          <Wrapper>
            <GameCreator />
          </Wrapper>
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  // should be wait to finishd preparation
  await waitFor(() => Promise.resolve());

  await userEvent.type(screen.getByLabelText("Name"), "foobar");
  await userEvent.clear(screen.getByLabelText("Points"));
  await userEvent.type(screen.getByLabelText("Points"), "a,b,c");
  await userEvent.click(screen.getByText("Submit"));

  // Assert
  expect(screen.queryByText("Invalid name")).toBeNull();
  expect(screen.queryByText("Invalid points")).not.toBeNull();
});
