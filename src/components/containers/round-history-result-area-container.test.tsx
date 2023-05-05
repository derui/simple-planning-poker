import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { RoundHistoryResultAreaContainer } from "./round-history-result-area-container";
import * as User from "@/domains/user";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomFinishedRound, randomGame } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { openFinishedRoundsSuccess, openRoundHistory } from "@/status/actions/round";

afterEach(cleanup);

test("should dsiplay skeleton when loading", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });

  store.dispatch(tryAuthenticateSuccess({ user }));

  render(
    <Provider store={store}>
      <RoundHistoryResultAreaContainer />
    </Provider>
  );

  expect(screen.getAllByTestId("estimations/loading/root")).toHaveLength(2);
  expect(screen.getByTestId("table-loading/root")).not.toBeNull();
});

test("do not display any buttons", async () => {
  expect.assertions(1);

  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const round = randomFinishedRound();

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game: randomGame({ owner: user.id, round: round.id }), players: [user] }));
  store.dispatch(openFinishedRoundsSuccess([round]));
  store.dispatch(openRoundHistory(round.id));

  render(
    <Provider store={store}>
      <RoundHistoryResultAreaContainer />
    </Provider>
  );

  expect(screen.queryByText("Viewing round history")).not.toBeNull();
});

test("show round theme and can not change it", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const round = randomFinishedRound({ theme: "finished round" });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game: randomGame({ owner: user.id, round: round.id }), players: [user] }));
  store.dispatch(openFinishedRoundsSuccess([round]));
  store.dispatch(openRoundHistory(round.id));

  render(
    <Provider store={store}>
      <RoundHistoryResultAreaContainer />
    </Provider>
  );

  expect(screen.getByText("finished round")).not.toBeNull();
  expect(screen.getByTestId("themeEditor/theme").getAttribute("aria-disabled")).toBe("true");
});
