import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { Toolbar } from "./toolbar.js";

afterEach(cleanup);

test("should be able to render", () => {
  const ret = render(<Toolbar defaultRole="player" />);

  expect(ret.container).toMatchSnapshot();
});

test("should not call handler after initial render", () => {
  render(
    <Toolbar
      defaultRole="inspector"
      onToggleRole={() => {
        expect.fail("Do not call initial render");
      }}
    />
  );
});

test("get changed role from player to inspector", async () => {
  expect.assertions(1);

  render(
    <Toolbar
      defaultRole="player"
      onToggleRole={() => {
        expect(true).toBe(true);
      }}
    />
  );

  await userEvent.click(screen.getByText("Player"));
});

test("get changed role from inspector to player", async () => {
  expect.assertions(1);

  render(
    <Toolbar
      defaultRole="inspector"
      onToggleRole={() => {
        expect(true).toBe(true);
      }}
    />
  );

  await userEvent.click(screen.getByText("Inspector"));
});
