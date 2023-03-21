import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimations } from "./player-estimations";
import { UserMode } from "@/domains/game-player";
import { UserEstimationInfo } from "@/status/selectors/user-hand";

afterEach(cleanup);

test("display empty lane", async () => {
  render(<PlayerEstimations hands={[]} />);

  expect(screen.queryAllByTestId("hand/root")).toHaveLength(0);
});

test("display a hand", async () => {
  const hands = [
    { userName: "name", userMode: UserMode.inspector, displayValue: "value", state: "notSelected" } as const,
  ];
  render(<PlayerEstimations hands={hands} />);

  expect(screen.queryAllByTestId("name/root")).toHaveLength(1);
});

test("display three hands", async () => {
  const hands = [
    { userName: "name", userMode: UserMode.inspector, displayValue: "value", state: "notSelected" },
    { userName: "name2", userMode: UserMode.normal, displayValue: "value", state: "notSelected" },
    { userName: "name3", userMode: UserMode.normal, displayValue: "value", state: "estimated" },
  ] satisfies UserEstimationInfo[];
  render(<PlayerEstimations hands={hands} />);

  expect(screen.queryByText("name")).not.toBeNull();
  expect(screen.queryByText("name2")).not.toBeNull();
  expect(screen.queryByText("name3")).not.toBeNull();
});