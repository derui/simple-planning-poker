import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { Toolbar } from "./toolbar.js";

afterEach(cleanup);

test("should be able to render", () => {
  const ret = render(<Toolbar defaultRole="player" />);

  expect(ret.container).toMatchSnapshot();
});

test("should change current check", () => {
  const ret = render(<Toolbar defaultRole="inspector" />);

  expect(ret.container).toMatchSnapshot();
  expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBeTruthy();
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
      onToggleRole={(role) => {
        expect(role).toEqual("inspector");
      }}
    />
  );

  await userEvent.click(screen.getByRole("switch"));
});

test("get changed role from inspector to player", async () => {
  expect.assertions(1);

  render(
    <Toolbar
      defaultRole="inspector"
      onToggleRole={(role) => {
        expect(role).toEqual("player");
      }}
    />
  );

  await userEvent.click(screen.getByRole("switch"));
});
