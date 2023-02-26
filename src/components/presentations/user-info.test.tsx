import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { UserInfo } from "./user-info";
import { UserMode } from "@/domains/game-player";

afterEach(cleanup);

test("should not open initial", () => {
  render(<UserInfo name="name" mode={UserMode.normal} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(screen.getByTestId("indicator").getAttribute("data-opened")).toBe("false");
  expect(screen.getByTestId("name").textContent).toMatch(/name/);
});

test("should open updater when clicked", async () => {
  render(<UserInfo name="name" mode={UserMode.normal} />);

  await userEvent.click(screen.getByTestId("root"));

  expect(screen.getByTestId("indicator").getAttribute("data-opened")).toBe("true");
});
