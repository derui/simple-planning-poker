import { test, afterEach, expect } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Provider } from "react-redux";
import { RoundHistoriesSidebarContainer } from "./round-histories-sidebar-container";
import { createPureStore } from "@/status/store";
import {
  nextPageOfRoundHistories,
  closeRoundHistories,
  openRoundHistories,
  openRoundHistoriesSuccess,
  resetPageOfRoundHistories,
  nextPageOfRoundHistoriesSuccess,
} from "@/status/actions/round";
import * as Round from "@/domains/round";
import * as SC from "@/domains/selectable-cards";
import * as S from "@/domains/story-point";
import { fromFinishedRound } from "@/status/query-models/round-history";

afterEach(cleanup);

const cards = SC.create([S.create(1)]);

test("should be able to render", () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <RoundHistoriesSidebarContainer />
    </Provider>
  );

  expect(screen.getAllByTestId("skeleton/root")).toHaveLength(4);
});

test("list a round if loading finished", () => {
  const store = createPureStore();

  store.dispatch(
    openRoundHistoriesSuccess({
      rounds: [
        Round.finishedRoundOf({
          id: Round.createId("id"),
          cards,
          estimations: [],
          finishedAt: "2023-01-02T10:00:01",
          theme: "theme",
        }),
      ].map(fromFinishedRound),
      lastKey: "key",
    })
  );

  render(
    <Provider store={store}>
      <RoundHistoriesSidebarContainer />
    </Provider>
  );

  expect(screen.getAllByTestId("round/id/root")).toHaveLength(1);
  expect(screen.getByTestId("round/id/root").textContent).toMatch("2023/01/02");
  expect(screen.getByTestId("round/id/root").textContent).toMatch("theme");
  expect(screen.getByTestId("back").getAttribute("disabled")).not.toBeNull();
  expect(screen.getByTestId("forward").getAttribute("disabled")).toBeNull();
});

test("dispatch event when opened and closed", async () => {
  expect.assertions(3);
  const store = createPureStore();

  store.replaceReducer((state, action) => {
    if (openRoundHistories.match(action)) {
      expect(true);
    }

    if (closeRoundHistories.match(action)) {
      expect(true);
    }

    return state!;
  });

  render(
    <Provider store={store}>
      <RoundHistoriesSidebarContainer />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("pullTab"));
  await userEvent.click(screen.getByTestId("pullTab"));
});

test("change page forward", async () => {
  expect.assertions(1);
  const store = createPureStore();

  store.dispatch(
    openRoundHistoriesSuccess({
      rounds: [
        Round.finishedRoundOf({
          id: Round.createId("id"),
          cards,
          estimations: [],
          finishedAt: "2023-01-02T10:00:01",
          theme: "theme",
        }),
      ].map(fromFinishedRound),
      lastKey: "key",
    })
  );

  store.replaceReducer((state, action) => {
    if (nextPageOfRoundHistories.match(action)) {
      expect(true);
    }

    return state!;
  });

  render(
    <Provider store={store}>
      <RoundHistoriesSidebarContainer />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("pullTab"));
  await userEvent.click(screen.getByTestId("forward"));
});

test("change page backward", async () => {
  expect.assertions(1);
  const store = createPureStore();

  store.dispatch(
    openRoundHistoriesSuccess({
      rounds: [
        Round.finishedRoundOf({
          id: Round.createId("id"),
          cards,
          estimations: [],
          finishedAt: "2023-01-02T10:00:01",
          theme: "theme",
        }),
      ].map(fromFinishedRound),
      lastKey: "key",
    })
  );
  store.dispatch(
    nextPageOfRoundHistoriesSuccess({
      rounds: [
        Round.finishedRoundOf({
          id: Round.createId("id"),
          cards,
          estimations: [],
          finishedAt: "2023-01-02T10:00:01",
          theme: "theme",
        }),
      ].map(fromFinishedRound),
      lastKey: "key",
    })
  );

  store.replaceReducer((state, action) => {
    if (resetPageOfRoundHistories.match(action)) {
      expect(true);
    }

    return state!;
  });

  render(
    <Provider store={store}>
      <RoundHistoriesSidebarContainer />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("pullTab"));
  await userEvent.click(screen.getByTestId("back"));
});

test("dispatch event when round clicked", async () => {
  expect.assertions(1);
  const store = createPureStore();

  store.dispatch(
    openRoundHistoriesSuccess({
      rounds: [
        Round.finishedRoundOf({
          id: Round.createId("id"),
          cards,
          estimations: [],
          finishedAt: "2023-01-02T10:00:01",
          theme: "theme",
        }),
      ].map(fromFinishedRound),
      lastKey: "key",
    })
  );

  render(
    <Provider store={store}>
      <RoundHistoriesSidebarContainer
        onRoundSelect={(id) => {
          expect(id).toBe("id");
        }}
      />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("round/id/root"));
});
