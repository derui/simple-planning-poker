import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GameInfo } from "./game-info";

afterEach(cleanup);

test("should be able to render", async () => {
  render(<GameInfo gameName="name" onLeaveGame={() => {}} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
});

test("render game name", async () => {
  render(<GameInfo gameName="name" onLeaveGame={() => {}} />);

  expect(screen.getByText("name")).not.toBeNull();
});

test("callback when click leave button", async () => {
  expect.assertions(1);
  render(
    <GameInfo
      gameName="name"
      onLeaveGame={() => {
        expect(true).toBe(true);
      }}
    />
  );

  await userEvent.click(screen.getByRole("button"));
});
