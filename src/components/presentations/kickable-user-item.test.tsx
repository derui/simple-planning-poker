import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { KickableUserItem } from "./kickable-user-item";

afterEach(cleanup);

test("should be able to render", () => {
  render(<KickableUserItem name="name of user" />);

  expect(screen.queryByText("name of user")).not.toBeNull();
  expect(screen.queryByTestId("kick/root")).toBeNull();
});

test("show kick button when passed callback", () => {
  render(<KickableUserItem name="name of user" onKick={() => {}} />);

  expect(screen.queryByText("name of user")).not.toBeNull();
  expect(screen.queryByTestId("kick/root")).not.toBeNull();
});

test("display confirmation after clicking kick button", async () => {
  render(<KickableUserItem name="name of user" onKick={() => {}} />);

  await userEvent.click(screen.getByText("Kick"));

  expect(screen.queryByText("name of user")).not.toBeNull();
  expect(screen.queryByText("Yes")).not.toBeNull();
  expect(screen.queryByTestId("kick/cancel")).not.toBeNull();
  expect(screen.queryByText("Kick")).toBeNull();
});

test("call callback when confirmation was clicked", async () => {
  expect.assertions(2);

  render(
    <KickableUserItem
      name="name of user"
      onKick={() => {
        expect(true);
      }}
    />
  );

  await userEvent.click(screen.getByText("Kick"));
  await userEvent.click(screen.getByText("Yes"));

  expect(screen.queryByText("Kick")).not.toBeNull();
});

test("do not call callback when cancel was clicked", async () => {
  expect.assertions(1);

  render(
    <KickableUserItem
      name="name of user"
      onKick={() => {
        expect(false);
      }}
    />
  );

  await userEvent.click(screen.getByText("Kick"));
  await userEvent.click(screen.getByTestId("kick/cancel"));

  expect(screen.queryByText("Kick")).not.toBeNull();
});
