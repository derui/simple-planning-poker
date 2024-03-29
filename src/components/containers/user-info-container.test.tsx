import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import sinon from "sinon";
import { UserInfoContainer } from "./user-info-container";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomCards, randomGame } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { changeNameSuccess } from "@/status/actions/user";

afterEach(cleanup);
afterEach(sinon.reset);

test("should not open initial", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const [game] = Game.create({
    id: Game.createId(),
    name: "game",
    owner: user.id,
    cards: randomCards(),
    round: Round.createId(),
  });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <UserInfoContainer />
    </Provider>
  );

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.getByTestId("indicator").getAttribute("data-opened")).toBe("false");
  expect(screen.getByTestId("name").textContent).toMatch(/name/);
});

test("should open updater when clicked", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const game = randomGame({ owner: user.id });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <UserInfoContainer />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("root"));

  expect(screen.getByTestId("indicator").getAttribute("data-opened")).toBe("true");
});

test("should dispatch after changed", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const game = randomGame({ owner: user.id });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <UserInfoContainer />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("root"));
  await userEvent.type(screen.getByTestId("updater/nameEditorInput"), " add");
  await userEvent.click(screen.getByTestId("updater/submit"));

  expect(screen.getByTestId("indicator").getAttribute("data-opened")).toBe("false");
});

test("should update data after success", async () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const game = randomGame({ owner: user.id });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  render(
    <Provider store={store}>
      <UserInfoContainer />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("root"));
  await userEvent.type(screen.getByTestId("updater/nameEditorInput"), " add");
  await userEvent.click(screen.getByTestId("updater/submit"));

  store.dispatch(changeNameSuccess(User.changeName(user, "name add")[0]));

  await sinon.useFakeTimers().nextAsync();

  expect(screen.getByTestId("name").textContent).toMatch(/name add/);
});
