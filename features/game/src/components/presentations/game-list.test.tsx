import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { GameList } from "./game-list.js";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<GameList games={[]} />);

  expect(ret.container).toMatchSnapshot();
});

test("should be render game", () => {
  const ret = render(<GameList games={[{ id: "id", name: "Game 1", owned: false }]} />);

  expect(ret.container).toMatchSnapshot();
});

test("should call callback after click Add Game", async () => {
  const callback = Sinon.fake();
  render(<GameList games={[]} onCreate={callback} />);

  await userEvent.click(screen.getByText("Add Game"));

  expect(callback.calledOnce).toBeTruthy();
});

test("should call callback after click a game", async () => {
  const callback = Sinon.fake();
  render(<GameList games={[{ id: "id", name: "Target", owned: false }]} onSelect={callback} />);

  await userEvent.click(screen.getByText("Target"));

  expect(callback.calledOnceWith("id")).toBeTruthy();
});
