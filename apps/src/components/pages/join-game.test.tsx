import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { JoinGamePage } from "./join-game";
import { createPureStore } from "@/status/store";
import { joinGame } from "@/status/actions/game";

afterEach(cleanup);

test("render page", () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <JoinGamePage />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.queryByTestId("root")?.textContent).toMatch(/Joining to the game/);
});

test("dispatch event with signature", async () => {
  expect.assertions(1);
  const store = createPureStore();

  store.replaceReducer((state, action) => {
    if (joinGame.match(action)) {
      expect(action.payload).toBe("signature");
    }

    return state!;
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/abc/signature"]}>
        <Routes>
          <Route path="abc/:signature" element={<JoinGamePage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
});
