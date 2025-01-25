import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

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
