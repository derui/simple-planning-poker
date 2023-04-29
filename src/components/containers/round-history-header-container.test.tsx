import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import { RoundHistoryHeaderContainer } from "./round-history-header-container";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
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
    finishedRounds: [],
    owner: user.id,
    cards: randomCards(),
    round: Round.createId(),
  });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <RoundHistoryHeaderContainer onBack={() => {}} />
    </Provider>
  );

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.queryByTestId("game-info/root")?.textContent).toMatch(/game/);
});

test("should display skeleton if game or user do not initialized", async () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <RoundHistoryHeaderContainer onBack={() => {}} />
    </Provider>
  );

  expect(screen.queryByTestId("loading/root")).not.toBeNull();
});

test("should display leave button", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId("user"), name: "name" });
  let [game] = Game.create({
    id: Game.createId(),
    name: "game",
    finishedRounds: [],
    owner: User.createId("owner"),
    cards: randomCards(),
    round: Round.createId(),
  });
  game = Game.joinUserAsPlayer(game, user.id, Game.makeInvitation(game))[0];

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <RoundHistoryHeaderContainer onBack={() => {}} />
    </Provider>
  );

  expect(screen.queryByTestId("game-info/leave")).not.toBeNull();
});

test("handle event on back", async () => {
  expect.assertions(1);

  const store = createPureStore();
  const user = User.create({ id: User.createId("user"), name: "name" });
  let [game] = Game.create({
    id: Game.createId(),
    name: "game",
    finishedRounds: [],
    owner: User.createId("owner"),
    cards: randomCards(),
    round: Round.createId(),
  });
  game = Game.joinUserAsPlayer(game, user.id, Game.makeInvitation(game))[0];

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <RoundHistoryHeaderContainer
        onBack={() => {
          expect(true);
        }}
      />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("game-info/backToTop"));
});
