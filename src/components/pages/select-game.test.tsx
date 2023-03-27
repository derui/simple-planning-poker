import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { SelectGamePage } from "./select-game";
import { createPureStore } from "@/status/store";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { signInSuccess } from "@/status/actions/signin";
import { JoinedGameState } from "@/domains/game-repository";

afterEach(cleanup);

test("render page", () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <SelectGamePage />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByText("Create Game")).not.toBeNull();
});

test("show empty if games is empty", async () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <SelectGamePage />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByText(/You do not have games/)).not.toBeNull();
});

test("show empty if games is empty", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "foo" });

  store.dispatch(
    signInSuccess({
      user,
      joinedGames: {
        [Game.createId()]: { name: "name", state: JoinedGameState.joined },
        [Game.createId()]: { name: "long name", state: JoinedGameState.joined },
        [Game.createId()]: { name: "looooong name", state: JoinedGameState.joined },
      },
    })
  );

  render(
    <Provider store={store}>
      <MemoryRouter>
        <SelectGamePage />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getAllByTestId("game-name")).toHaveLength(3);
  expect(screen.getAllByTestId("game-name").map((v) => v.textContent)).toEqual(
    expect.arrayContaining(["name", "long name", "looooong name"])
  );
});

test("disable join button when token is empty", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "foo" });

  store.dispatch(
    signInSuccess({
      user,
      joinedGames: {
        [Game.createId()]: { name: "name", state: JoinedGameState.joined },
        [Game.createId()]: { name: "long name", state: JoinedGameState.joined },
        [Game.createId()]: { name: "looooong name", state: JoinedGameState.joined },
      },
    })
  );

  render(
    <Provider store={store}>
      <MemoryRouter>
        <SelectGamePage />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByPlaceholderText(/Paste invitation/)).toHaveProperty("value", "");
  expect(screen.getByRole("button", { name: "Join" }).getAttribute("disabled")).not.toBeNull();
});

test("enable join button after type invitation", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "foo" });

  store.dispatch(
    signInSuccess({
      user,
      joinedGames: {
        [Game.createId()]: { name: "name", state: JoinedGameState.joined },
        [Game.createId()]: { name: "long name", state: JoinedGameState.joined },
        [Game.createId()]: { name: "looooong name", state: JoinedGameState.joined },
      },
    })
  );

  render(
    <Provider store={store}>
      <MemoryRouter>
        <SelectGamePage />
      </MemoryRouter>
    </Provider>
  );

  await userEvent.type(screen.getByPlaceholderText(/Paste invitation/), "invitation");

  expect(screen.getByRole("button", { name: "Join" }).getAttribute("disabled")).toBeNull();
});
