import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { SelectGamePage } from "./select-game";
import { createPureStore } from "@/status/store";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { signInSuccess } from "@/status/actions/signin";

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
        [Game.createId()]: "name",
        [Game.createId()]: "long name",
        [Game.createId()]: "looooong name",
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
