import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { JoinedUserList } from "./joined-user-list";
import { createId } from "@/domains/user";

afterEach(cleanup);

test("should be able to render", () => {
  render(<JoinedUserList users={[]} />);
});

test("open list clicked", async () => {
  render(<JoinedUserList users={[]} />);

  await userEvent.click(screen.getByTestId("opener"));

  expect(screen.getByTestId("opener").dataset["opened"]).toBe("true");
  expect(screen.getByTestId("list").dataset["opened"]).toBe("true");
});

test("display users", async () => {
  render(
    <JoinedUserList
      users={[
        { name: "name", id: createId("id") },
        { name: "other", id: createId("other") },
      ]}
    />
  );

  expect(screen.getByTestId("name/root").textContent).toMatch(/name/);
  expect(screen.getByTestId("other/root").textContent).toMatch(/other/);
});

test("raise event when user confirmed to kick", async () => {
  expect.assertions(1);
  render(
    <JoinedUserList
      users={[
        { name: "name", id: createId("id") },
        { name: "other", id: createId("other") },
      ]}
      onKick={(id) => {
        expect(id).toBe(createId("id"));
      }}
    />
  );

  await userEvent.click(screen.getByTestId("name/kick/main"));
  await userEvent.click(screen.getByTestId("name/kick/confirm"));
});
