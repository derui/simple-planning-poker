import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Dialog } from "./dialog.js";

afterEach(cleanup);

test("should be able to render", () => {
  render(<Dialog title="title" />);

  expect(screen.queryByText("title")).not.toBeNull();
});

test("display children", () => {
  render(
    <Dialog title="title">
      <span>child</span>
    </Dialog>
  );

  expect(screen.queryByText("child")).not.toBeNull();
});
