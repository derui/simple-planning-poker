import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dialog } from "./dialog";

afterEach(cleanup);

test("should be able to render", () => {
  render(<Dialog title="title" onSubmitClick={() => {}} loading={false} />);

  expect(screen.queryByText("title")).not.toBeNull();
  expect(screen.queryByText("Submit")?.tagName).toBe("BUTTON");
});

test("display children", () => {
  render(
    <Dialog title="title" onSubmitClick={() => {}} loading={false}>
      <span>child</span>
    </Dialog>
  );

  expect(screen.queryByText("child")).not.toBeNull();
});

test("handle click footer button", async () => {
  expect.assertions(1);
  render(
    <Dialog
      title="title"
      onSubmitClick={() => {
        expect(true);
      }}
      loading={false}
    />
  );

  await userEvent.click(screen.getByRole("button"));
});

test("disable button while loading", async () => {
  render(<Dialog title="title" onSubmitClick={() => {}} loading={true} />);

  expect(screen.getByRole("button")).toHaveProperty("disabled", true);
});
