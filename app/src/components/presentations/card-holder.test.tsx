import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CardHolder } from "./card-holder";

afterEach(cleanup);

test("should be able to render", async () => {
  render(<CardHolder displays={[]} selectedIndex={0} onSelect={() => {}} />);

  expect(screen.queryByTestId("root")).not.toBeNull();
});

test("render cards with display", async () => {
  render(<CardHolder displays={["1", "2", "3"]} selectedIndex={-1} onSelect={() => {}} />);

  expect(screen.getAllByTestId("card/root")).toHaveLength(3);
  expect(screen.getAllByTestId("card/root")[0].textContent).toMatch(/1/);
  expect(screen.getAllByTestId("card/root")[1].textContent).toMatch(/2/);
  expect(screen.getAllByTestId("card/root")[2].textContent).toMatch(/3/);
});

test("mark selected", async () => {
  render(<CardHolder displays={["1", "2", "3"]} selectedIndex={1} onSelect={() => {}} />);

  expect(screen.getAllByTestId("card/root")).toHaveLength(3);
  expect(screen.getAllByTestId("card/root")[0].dataset).toHaveProperty("selected", "false");
  expect(screen.getAllByTestId("card/root")[1].dataset).toHaveProperty("selected", "true");
  expect(screen.getAllByTestId("card/root")[2].dataset).toHaveProperty("selected", "false");
});

test("get index of clicked card", async () => {
  expect.assertions(1);

  render(
    <CardHolder
      displays={["1", "2", "3"]}
      selectedIndex={1}
      onSelect={(index) => {
        expect(index).toBe(0);
      }}
    />
  );

  await userEvent.click(screen.getAllByTestId("card/root")[0]);
});
