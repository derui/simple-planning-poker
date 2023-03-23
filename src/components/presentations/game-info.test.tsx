import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router";
import { GameInfo } from "./game-info";

afterEach(cleanup);

test("should be able to render", async () => {
  render(
    <MemoryRouter>
      <GameInfo gameName="name" onLeaveGame={() => {}} />
    </MemoryRouter>
  );

  expect(screen.queryByTestId("root")).not.toBeNull();
});

test("render game name", async () => {
  render(
    <MemoryRouter>
      <GameInfo gameName="name" onLeaveGame={() => {}} />
    </MemoryRouter>
  );

  expect(screen.getByText("name")).not.toBeNull();
});

test("callback when click leave button", async () => {
  expect.assertions(1);
  render(
    <MemoryRouter>
      <GameInfo
        gameName="name"
        onLeaveGame={() => {
          expect(true).toBe(true);
        }}
      />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole("button"));
});

test("back to top page", async () => {
  expect.assertions(1);

  const routes = createMemoryRouter([
    { index: true, path: "/", element: <GameInfo gameName="name" onLeaveGame={() => {}} /> },
  ]);

  render(<RouterProvider router={routes} />);

  await userEvent.click(screen.getByTestId("backToTop"));

  await waitFor(() => {
    expect(routes.state.location.pathname).toBe("/game");
  });
});
