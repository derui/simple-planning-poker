import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { UserNameEditor } from "./user-name-editor.js";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<UserNameEditor defaultValue="foo" />);

  expect(ret.container).toMatchSnapshot();
});

test("should focus input first", () => {
  // Arrange
  render(<UserNameEditor defaultValue="foo" />);

  // Act
  const input = screen.getByRole("textbox");

  // Assert
  expect(input?.matches(":focus")).toBeTruthy();
});

test("should call submit callback after submitting", async () => {
  // Arrange
  const submit = Sinon.fake();
  render(<UserNameEditor defaultValue="foo" onSubmit={submit} />);

  // Act
  await userEvent.type(screen.getByRole("textbox"), "foobar");
  await userEvent.click(screen.getByRole("button", { name: "Submit" }));

  // Assert
  expect(submit.calledOnce).toBeTruthy();
  expect(submit.lastCall.args).toEqual(["foofoobar"]);
});

test("should cancel when cancel button is clicked", async () => {
  // Arrange
  const cancel = Sinon.fake();
  render(<UserNameEditor defaultValue="foo" onCancel={cancel} />);

  // Act
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

  // Assert
  expect(cancel.called).toBeTruthy();
});
