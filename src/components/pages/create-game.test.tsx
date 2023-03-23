import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import { CreateGamePage } from "./create-game";
import { createPureStore } from "@/status/store";
import { createGame } from "@/status/actions/game";

afterEach(cleanup);

const route = createMemoryRouter([{ path: "/", element: <CreateGamePage /> }]);

test("render page", () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  );

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.getByLabelText("Name")).toHaveProperty("value", "");
  expect(screen.getByLabelText("Points")).toHaveProperty("value", "1,2,3,5,8,13,21,34,55,89");
  expect(screen.getByRole("button")).toHaveProperty("disabled", true);
});

test("dispatch event after submit", async () => {
  expect.assertions(2);
  const store = createPureStore();

  render(
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  );

  store.replaceReducer((state, action) => {
    if (createGame.match(action)) {
      expect(action.payload.name).toBe("test");
      expect(action.payload.points).toEqual([1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
    }

    return state!!;
  });

  await userEvent.type(screen.getByLabelText("Name"), "test");
  await userEvent.click(screen.getByRole("button"));
});

test("should be disabled when points are empty", async () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  );

  await userEvent.type(screen.getByLabelText("Name"), "test");
  await userEvent.clear(screen.getByLabelText("Points"));

  expect(screen.getByRole("button")).toHaveProperty("disabled", true);
});

test("should be disabled when points are invalid", async () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  );

  await userEvent.type(screen.getByLabelText("Name"), "test");
  await userEvent.clear(screen.getByLabelText("Points"));
  await userEvent.type(screen.getByLabelText("Points"), ",,,");

  expect(screen.getByRole("button")).toHaveProperty("disabled", true);
});
