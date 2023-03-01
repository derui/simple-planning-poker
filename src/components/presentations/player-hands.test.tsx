import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import PlayerHandsComponent from "./player-hands";
import { UserMode } from "@/domains/game-player";

afterEach(cleanup);

test("display empty lane", async () => {
  render(<PlayerHandsComponent hands={[]} opened={false} />);

  expect(screen.queryAllByTestId("hand/root")).toHaveLength(0);
});

test("display a hand", async () => {
  const hands = [{ userName: "name", userMode: UserMode.inspector, displayValue: "value", selected: false }];
  render(<PlayerHandsComponent hands={hands} opened={false} />);

  expect(screen.queryAllByTestId("hand/root")).toHaveLength(1);
});

test("display three hands", async () => {
  const hands = [
    { userName: "name", userMode: UserMode.inspector, displayValue: "value", selected: false },
    { userName: "name2", userMode: UserMode.normal, displayValue: "value", selected: false },
    { userName: "name3", userMode: UserMode.normal, displayValue: "value", selected: true },
  ];
  render(<PlayerHandsComponent hands={hands} opened={false} />);

  expect(screen.queryAllByTestId("hand/root")).toHaveLength(3);
  expect(screen.queryByText("name")).not.toBeNull();
  expect(screen.queryByText("name2")).not.toBeNull();
  expect(screen.queryByText("name3")).not.toBeNull();
});
