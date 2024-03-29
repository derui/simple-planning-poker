import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { GameAreaContainer } from "./game-area-container";
import * as User from "@/domains/user";
import { createPureStore, RootState } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { notifyRoundUpdated, showDown, changeTheme } from "@/status/actions/round";
import { randomGame, randomRound } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { notifyOtherUserChanged } from "@/status/actions/user";
import { joinUserAsPlayer, makeInvitation } from "@/domains/game";
import { takePlayerEstimation } from "@/domains/round";
import { giveUp } from "@/domains/user-estimation";

afterEach(cleanup);

test("render", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const player = User.create({ id: User.createId(), name: "player" });
  let game = randomGame({ owner: user.id });
  game = joinUserAsPlayer(game, player.id, makeInvitation(game))[0];
  const round = randomRound({ id: game.round });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(notifyOtherUserChanged(player));
  store.dispatch(openGameSuccess({ game, players: [user, player] }));
  store.dispatch(notifyRoundUpdated(round));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  expect(screen.queryAllByTestId("estimations/name/root")).toHaveLength(1);
  expect(screen.queryAllByTestId("estimations/player/root")).toHaveLength(1);
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
  let round = randomRound({ id: game.round });
  round = takePlayerEstimation(round, user.id, giveUp());

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));
  store.dispatch(notifyRoundUpdated(round));

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

test("do not display button if no user estimated", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const game = randomGame({ owner: user.id });
  const round = randomRound({ id: game.round });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));
  store.dispatch(notifyRoundUpdated(round));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  expect(screen.getByText(/Waiting/)).not.toBeNull();
});

test("display round theme as editor", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const game = randomGame({ owner: user.id });
  const round = randomRound({ id: game.round, theme: "theme" });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));
  store.dispatch(notifyRoundUpdated(round));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  expect(screen.getByText(/theme/)).not.toBeNull();
});

test("dispatch changeTheme action", async () => {
  expect.assertions(1);
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const game = randomGame({ owner: user.id });
  const round = randomRound({ id: game.round, theme: "theme" });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));
  store.dispatch(notifyRoundUpdated(round));

  render(
    <Provider store={store}>
      <GameAreaContainer />
    </Provider>
  );

  store.replaceReducer((v, action) => {
    if (changeTheme.match(action)) {
      expect(action).toEqual(changeTheme("theme add"));
    }
    return v as RootState;
  });

  await userEvent.click(screen.getByTestId("themeEditor/theme"));
  await userEvent.type(screen.getByTestId("themeEditor/editor/input"), " add");
  await userEvent.click(screen.getByTestId("themeEditor/editor/submit"));
});
