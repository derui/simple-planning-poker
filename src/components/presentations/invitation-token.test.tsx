import { test, afterEach, expect } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InvitationToken } from "./invitation-token";

afterEach(cleanup);

test("should be able to render", async () => {
  render(<InvitationToken invitationToken="token" />);

  const ret = screen.findByTestId("root");

  expect(ret).not.toBeNull();
});

test("do not open default", async () => {
  render(<InvitationToken invitationToken="token" />);

  const ret = screen.getByTestId("root");

  expect(ret.dataset).toHaveProperty("opened", "false");
});

test("open container after click", async () => {
  render(<InvitationToken invitationToken="token" />);

  await userEvent.click(screen.getByTestId("opener"));

  const root = screen.getByTestId("root");
  const container = screen.getByTestId("container");

  expect(root.dataset).toHaveProperty("opened", "true");
  expect(container.classList.contains("animate-fade-in")).toBe(true);
});

test("display invitation link", async () => {
  render(<InvitationToken invitationToken="token" />);

  await userEvent.click(screen.getByTestId("opener"));

  const container = screen.getByRole("textbox");

  expect(container).toHaveProperty("value", "token");
});

test("raise event when click copy button", async () => {
  expect.assertions(1);

  render(<InvitationToken invitationToken="token" onCopy={() => expect(1)} />);

  await userEvent.click(screen.getByTestId("opener"));
  await userEvent.click(screen.getByTestId("copyButton"));
});
