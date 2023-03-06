import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { GameHeaderContainer } from "./game-header-container";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomCards } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";

afterEach(cleanup);

test("should not open initial", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const [game] = Game.create({
    id: Game.createId(),
    name: "game",
    joinedPlayers: [],
    finishedRounds: [],
    owner: user.id,
    cards: randomCards(),
  });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <GameHeaderContainer />
    </Provider>
  );

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.queryByTestId("game-info/root")?.textContent).toMatch(/game/);
  expect(screen.queryByTestId("user-info/root")?.textContent).toMatch(/name/);
});

test("should display skeleton if game or user do not initialized", async () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <GameHeaderContainer />
    </Provider>
  );

  expect(screen.queryByTestId("loading/root")).not.toBeNull();
});
