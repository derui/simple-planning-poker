import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { Overlay } from "./overlay.js";

afterEach(cleanup);

test("should be able to render", () => {
  render(<Overlay show={true} />);

  expect(screen.getByRole("dialog")).not.toBeNull();
});

test("should invisible overlay", () => {
  render(<Overlay show={false} />);

  expect(screen.getByRole("dialog")).not.toBeNull();
  expect(screen.getByRole("dialog").dataset).toHaveProperty("show", "false");
});

test("should be able to show with children", () => {
  render(
    <Overlay show={true}>
      <span>other content in </span>
    </Overlay>
  );

  expect(screen.getByRole("dialog").dataset).toHaveProperty("show", "true");
  expect(screen.getByText("other content in")).not.toBeNull();
});
