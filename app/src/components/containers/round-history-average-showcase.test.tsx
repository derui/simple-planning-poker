import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { RoundHistoryAverageShowcase } from "./round-history-average-showcase";
import { createPureStore } from "@/status/store";
import { openRoundHistorySuccess } from "@/status/actions/round";
import { randomFinishedRound, randomGame } from "@/test-lib";
import { openGameSuccess } from "@/status/actions/game";
import * as User from "@/domains/user";

afterEach(cleanup);

test("should be able to render", () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <RoundHistoryAverageShowcase />
    </Provider>
  );

  expect(screen.queryByTestId("skeleton/root")).not.toBeNull();
});

test("should be render average of round history", () => {
  const store = createPureStore();
  const round = randomFinishedRound();
  store.dispatch(
    openGameSuccess({
      game: randomGame({ joinedPlayers: [{ user: User.createId("id"), mode: "normal", type: "player" }] }),
      players: [{ id: User.createId("id"), name: "name" }],
    })
  );
  store.dispatch(openRoundHistorySuccess(round));

  render(
    <Provider store={store}>
      <RoundHistoryAverageShowcase />
    </Provider>
  );

  expect(screen.queryByTestId("skeleton/root")).toBeNull();
  expect(screen.queryByTestId("average-point/root")?.textContent).toMatch(/Score/);
});
