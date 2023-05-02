import { test, afterEach, expect } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Provider } from "react-redux";
import { RoundHistoriesSidebarContainer } from "./round-histories-sidebar-container";
import { createPureStore } from "@/status/store";
import {
  changePageOfFinishedRounds,
  changePageOfFinishedRoundsSuccess,
  closeFinishedRounds,
  openFinishedRounds,
  openFinishedRoundsSuccess,
} from "@/status/actions/round";
import * as Round from "@/domains/round";
import * as SC from "@/domains/selectable-cards";
import * as S from "@/domains/story-point";

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
    openFinishedRoundsSuccess([
      Round.finishedRoundOf({
        id: Round.createId("id"),
        cards,
        estimations: [],
        finishedAt: "2023-01-02T10:00:01",
        theme: "theme",
      }),
    ])
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
    if (openFinishedRounds.match(action)) {
      expect(true);
    }

    if (closeFinishedRounds.match(action)) {
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
    openFinishedRoundsSuccess([
      Round.finishedRoundOf({
        id: Round.createId("id"),
        cards,
        estimations: [],
        finishedAt: "2023-01-02T10:00:01",
        theme: "theme",
      }),
    ])
  );

  store.replaceReducer((state, action) => {
    if (changePageOfFinishedRounds.match(action)) {
      expect(action.payload).toBe(2);
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

test("change page forward", async () => {
  expect.assertions(1);
  const store = createPureStore();

  store.dispatch(
    changePageOfFinishedRoundsSuccess({
      rounds: [
        Round.finishedRoundOf({
          id: Round.createId("id"),
          cards,
          estimations: [],
          finishedAt: "2023-01-02T10:00:01",
          theme: "theme",
        }),
      ],
      page: 2,
    })
  );

  store.replaceReducer((state, action) => {
    if (changePageOfFinishedRounds.match(action)) {
      expect(action.payload).toBe(1);
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
    openFinishedRoundsSuccess([
      Round.finishedRoundOf({
        id: Round.createId("id"),
        cards,
        estimations: [],
        finishedAt: "2023-01-02T10:00:01",
        theme: "theme",
      }),
    ])
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
