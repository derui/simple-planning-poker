import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { GameResultAreaContainer } from "./game-result-area-container";
import * as User from "@/domains/user";
import { createPureStore } from "@/status/store";
import { newRound, openGameSuccess } from "@/status/actions/game";
import { randomGame } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { notifyOtherUserChanged } from "@/status/actions/user";
import { joinUserAsPlayer, makeInvitation } from "@/domains/game";

afterEach(cleanup);

test("should not open initial", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const player = User.create({ id: User.createId(), name: "player" });
  let game = randomGame({ owner: user.id });
  game = joinUserAsPlayer(game, player.id, makeInvitation(game))[0];

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(notifyOtherUserChanged(player));
  store.dispatch(openGameSuccess({ game, players: [user, player] }));

  render(
    <Provider store={store}>
      <GameResultAreaContainer />
    </Provider>
  );

  expect(screen.queryAllByTestId("hands/name/root")).toHaveLength(1);
  expect(screen.queryAllByTestId("hands/player/root")).toHaveLength(1);
});

test("should dsiplay skeleton when loading", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });

  store.dispatch(tryAuthenticateSuccess({ user }));

  render(
    <Provider store={store}>
      <GameResultAreaContainer />
    </Provider>
  );

  expect(screen.getByTestId("upper-loading/root")).not.toBeNull();
  expect(screen.getByTestId("lower-loading/root")).not.toBeNull();
  expect(screen.getByTestId("table-loading/root")).not.toBeNull();
});

test("dispatch new round event", async () => {
  expect.assertions(1);

  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game: randomGame({ owner: user.id }), players: [user] }));

  render(
    <Provider store={store}>
      <GameResultAreaContainer />
    </Provider>
  );

  store.replaceReducer((state, action) => {
    if (newRound.match(action)) {
      expect(true);
    }

    return state!!;
  });

  await userEvent.click(screen.getByText("Start next round"));
});
