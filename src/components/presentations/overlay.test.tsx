import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { Overlay } from "./overlay";

afterEach(cleanup);

test("should be able to render", async () => {
  render(<Overlay show={true} />);

  expect(screen.getByTestId("root")).not.toBeNull();
});

test("should invisible overlay", async () => {
  render(<Overlay show={false} />);

  expect(screen.getByTestId("root")).not.toBeNull();
  expect(screen.getByTestId("root").dataset).toHaveProperty("show", "false");
});

test("should be able to show with children", async () => {
  render(
    <Overlay show={true}>
      <span>other content in </span>
    </Overlay>
  );

  expect(screen.getByTestId("root").dataset).toHaveProperty("show", "true");
  expect(screen.getByText("other content in")).not.toBeNull();
});
