import { User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { createUseCreateGame } from "../../atoms/create-game.js";
import { CreateGameStatus } from "../../atoms/type.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
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
    useListGames: sinon.fake(),
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
    useListGames: sinon.fake(),
    useCreateGame() {
      return {
        errors: [],
        create: createFake,
        validate: sinon.fake.returns([]),
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

test("disable submit if loading", () => {
  // Arrange
  const store = createStore();

  const mock: Hooks = {
    useListGames: sinon.fake(),
    useCreateGame() {
      return {
        status: CreateGameStatus.Waiting,
        errors: [],
        create: sinon.fake(),
        validate: sinon.fake.returns([]),
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
    useListGames: sinon.fake(),
    useCreateGame: createUseCreateGame({
      gameRepository: newMemoryGameRepository(),
      dispatcher: sinon.fake(),
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
    }),
  };

  const Wrapper = ({ children }: PropsWithChildren) => {
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
    useListGames: sinon.fake(),
    useCreateGame: createUseCreateGame({
      gameRepository: newMemoryGameRepository(),
      dispatcher: sinon.fake(),
      useLoginUser: sinon.fake.returns({ userId: User.createId("id") }),
    }),
  };

  const Wrapper = ({ children }: PropsWithChildren) => {
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
