import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PlayerEstimations } from "./player-estimations";
import { UserMode } from "@/domains/game-player";
import { UserEstimationInfo } from "@/status/selectors/user-estimation";

afterEach(cleanup);

test("display empty lane", async () => {
  render(<PlayerEstimations estimations={[]} />);

  expect(screen.queryAllByTestId("estimation/root")).toHaveLength(0);
});

test("display a estimation", async () => {
  const estimations = [
    { userName: "name", userMode: UserMode.inspector, displayValue: "value", state: "notSelected" } as const,
  ];
  render(<PlayerEstimations estimations={estimations} />);

  expect(screen.queryAllByTestId("name/root")).toHaveLength(1);
});

test("display three estimations", async () => {
  const estimations = [
    { userName: "name", userMode: UserMode.inspector, displayValue: "value", state: "notSelected" },
    { userName: "name2", userMode: UserMode.normal, displayValue: "value", state: "notSelected" },
    { userName: "name3", userMode: UserMode.normal, displayValue: "value", state: "estimated" },
  ] satisfies UserEstimationInfo[];
  render(<PlayerEstimations estimations={estimations} />);

  expect(screen.queryByText("name")).not.toBeNull();
  expect(screen.queryByText("name2")).not.toBeNull();
  expect(screen.queryByText("name3")).not.toBeNull();
});

test("loading", async () => {
  const estimations = [
    { userName: "name", userMode: UserMode.inspector, displayValue: "value", state: "notSelected" } as const,
  ];
  render(<PlayerEstimations estimations={estimations} loading />);

  expect(screen.queryAllByTestId("name/root")).toHaveLength(0);
  expect(screen.queryByTestId("loading/root")).not.toBeNull();
});
