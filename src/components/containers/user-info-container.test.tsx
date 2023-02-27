import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { act } from "react-dom/test-utils";
import { UserInfoContainer } from "./user-info-container";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomCards, randomGame } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { changeNameSuccess } from "@/status/actions/user";

afterEach(cleanup);

test("should not open initial", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "name" });
  const [game] = Game.create({
    id: Game.createId(),
    name: "game",
    joinedPlayers: [],
    finishedRounds: [],
    owner: user.id,
    cards: randomCards(),
  });

  store.dispatch(openGameSuccess(game));
  store.dispatch(tryAuthenticateSuccess(user));

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

  store.dispatch(openGameSuccess(game));
  store.dispatch(tryAuthenticateSuccess(user));

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

  store.dispatch(openGameSuccess(game));
  store.dispatch(tryAuthenticateSuccess(user));

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

  store.dispatch(openGameSuccess(game));
  store.dispatch(tryAuthenticateSuccess(user));

  render(
    <Provider store={store}>
      <UserInfoContainer />
    </Provider>
  );

  await userEvent.click(screen.getByTestId("root"));
  await userEvent.type(screen.getByTestId("updater/nameEditorInput"), " add");
  await userEvent.click(screen.getByTestId("updater/submit"));

  act(() => {
    store.dispatch(changeNameSuccess(User.changeName(user, "name add")[0]));
  });

  expect(screen.getByTestId("name").textContent).toMatch(/name add/);
});
