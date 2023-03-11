import { test, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { GameRoutingNavigator } from "./game-routing-navigator";
import { createPureStore } from "@/status/store";

afterEach(cleanup);

test("do not navigate game not loaded", async () => {
  const store = createPureStore();

  const router = createMemoryRouter([
    {
      path: "/",
      element: <GameRoutingNavigator />,
    },
    {
      path: "/game/:gameId/round/:roundId",
      loader: () => {
        expect.fail("do not come this location");
      },

      element: null,
    },
  ]);

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
});
