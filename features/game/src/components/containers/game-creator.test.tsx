import { User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { PropsWithChildren, useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { CreateGameStatus, createUseCreateGame, createUsePrepareGame } from "../../atoms/game.js";
import { hooks, Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameCreator } from "./game-creator.js";

afterEach(cleanup);

test("render page", () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useCreateGame() {
      return {
        errors: [],
        validate: sinon.fake(),
        create: sinon.fake(),
      };
    },
    usePrepareGame: sinon.fake(),
    useListGame: sinon.fake(),
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
    useListGame: sinon.fake(),
    useCreateGame() {
      return {
        errors: [],
        create: createFake,
        validate: sinon.fake.returns([]),
      };
    },
    usePrepareGame: sinon.fake(),
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
    useListGame: sinon.fake(),
    useCreateGame() {
      return {
        status: CreateGameStatus.Waiting,
        errors: [],
        create: sinon.fake(),
        validate: sinon.fake.returns([]),
      };
    },
    usePrepareGame: sinon.fake(),
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
    useListGame: sinon.fake(),
    useCreateGame: createUseCreateGame(newMemoryGameRepository(), sinon.fake()),
    usePrepareGame: createUsePrepareGame(newMemoryGameRepository()),
  };

  const Wrapper = ({ children }: PropsWithChildren) => {
    const { prepare } = hooks.usePrepareGame();

    useEffect(() => {
      prepare(User.createId());
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

  await userEvent.click(screen.getByLabelText("Name"));
  await userEvent.type(screen.getByLabelText("Name"), "[Tab]");

  // Assert
  expect(screen.queryByText("Invalid name")).not.toBeNull();
});

test("show error if points is invalid", async () => {
  // Arrange
  const store = createStore();

  const mock: Hooks = {
    useListGame: sinon.fake(),
    useCreateGame: createUseCreateGame(newMemoryGameRepository(), sinon.fake()),
    usePrepareGame: createUsePrepareGame(newMemoryGameRepository()),
  };

  const Wrapper = ({ children }: PropsWithChildren) => {
    const { prepare } = hooks.usePrepareGame();

    useEffect(() => {
      prepare(User.createId());
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
  await userEvent.type(screen.getByLabelText("Points"), "a,b,c[Tab]");

  // Assert
  expect(screen.queryByText("Invalid name")).toBeNull();
  expect(screen.queryByText("Invalid points")).not.toBeNull();
});
