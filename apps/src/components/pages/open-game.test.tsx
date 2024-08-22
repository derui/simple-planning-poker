import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import OpenGamePage from "./open-game";
import { createPureStore } from "@/status/store";
import { openGame } from "@/status/actions/game";

afterEach(cleanup);

test("render page", () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <OpenGamePage />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.queryByTestId("root")?.textContent).toMatch(/Opening the game/);
});

test("dispatch event with signature", async () => {
  expect.assertions(1);
  const store = createPureStore();

  store.replaceReducer((state, action) => {
    if (openGame.match(action)) {
      expect(action.payload).toBe("some-game");
    }

    return state!;
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/abc/some-game"]}>
        <Routes>
          <Route path="abc/:gameId" element={<OpenGamePage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
});
