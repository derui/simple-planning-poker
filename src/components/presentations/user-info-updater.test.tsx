import { cleanup, getByRole, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { UserInfoUpdater } from "./user-info-updater";
import { UserMode } from "@/domains/game-player";

afterEach(cleanup);

test("should not open initial", () => {
  render(<UserInfoUpdater name="initial" mode={UserMode.normal} onChangeUserInfo={() => {}} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
  expect(getByRole(screen.getByTestId("nameEditor"), "textbox")).toHaveProperty("value", "initial");
});

test("apply name and mode", async () => {
  expect.assertions(3);

  render(
    <UserInfoUpdater
      name="name"
      mode={UserMode.normal}
      onChangeUserInfo={(mode, name) => {
        expect(mode).toBe(UserMode.inspector);
        expect(name).toBe("changed");
      }}
    />
  );

  await userEvent.clear(getByRole(screen.getByTestId("nameEditor"), "textbox"));
  await userEvent.type(getByRole(screen.getByTestId("nameEditor"), "textbox"), "changed");
  await userEvent.click(screen.getByLabelText("Inspector"));

  expect(screen.getByLabelText("Inspector")).toHaveProperty("checked", true);

  await userEvent.click(screen.getByTestId("submit"));
});

test("should be disabled if name is not valid", async () => {
  render(
    <UserInfoUpdater
      name="name"
      mode={UserMode.normal}
      onChangeUserInfo={() => {
        expect.fail("failed");
      }}
    />
  );

  await userEvent.clear(getByRole(screen.getByTestId("nameEditor"), "textbox"));
  await userEvent.click(screen.getByLabelText("Normal"));

  const button = screen.getByTestId("submit");
  expect(button.getAttribute("disabled")).not.toBeNull();
});
