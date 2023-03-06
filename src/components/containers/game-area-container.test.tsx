import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { GameAreaContainer } from "./game-area-container";
import * as User from "@/domains/user";
import { createPureStore } from "@/status/store";
import { showDown, openGameSuccess } from "@/status/actions/game";
import { randomGame } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { UserMode } from "@/domains/game-player";
import { notifyOtherUserChanged } from "@/status/actions/user";
import { acceptPlayerHand } from "@/domains/game";
import { giveUp } from "@/domains/user-hand";

afterEach(cleanup);

test("render", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const player = User.create({ id: User.createId(), name: "player" });
  const game = randomGame({ owner: user.id, joinedPlayers: [{ user: player.id, mode: UserMode.normal }] });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(notifyOtherUserChanged(player));
  store.dispatch(openGameSuccess({ game, players: [user, player] }));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  expect(screen.queryAllByTestId("upper/hand/root")).toHaveLength(1);
  expect(screen.queryAllByTestId("lower/hand/root")).toHaveLength(1);
});

test("should dsiplay skeleton when loading", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });

  store.dispatch(tryAuthenticateSuccess({ user }));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  expect(screen.getByTestId("upper-loading/root")).not.toBeNull();
  expect(screen.getByTestId("lower-loading/root")).not.toBeNull();
  expect(screen.getByTestId("table-loading/root")).not.toBeNull();
});

test("dispatch show down event", async () => {
  expect.assertions(1);

  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  let game = randomGame({ owner: user.id });
  game = acceptPlayerHand(game, user.id, giveUp());

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  store.replaceReducer((state, action) => {
    if (showDown.match(action)) {
      expect(true);
    }

    return state!!;
  });

  await userEvent.click(screen.getByText("Show down!"));
});

test("do not display button if no user handed", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const game = randomGame({ owner: user.id });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  expect(screen.getByText(/Waiting/)).not.toBeNull();
});
