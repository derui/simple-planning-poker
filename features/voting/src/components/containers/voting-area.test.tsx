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
