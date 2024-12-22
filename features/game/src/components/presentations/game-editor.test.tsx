import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { GameEditor } from "./game-editor.js";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<GameEditor />);

  expect(ret.container).toMatchSnapshot();
});

test("call callback after submit", async () => {
  // Arrange
  const callback = sinon.fake();

  render(<GameEditor onSubmit={callback} />);

  // Act
  await userEvent.type(screen.getByLabelText("Name"), "test");
  await userEvent.type(screen.getByLabelText("Points"), "1,2,3");
  await userEvent.click(screen.getByText("Submit"));

  // Assert
  expect(callback.calledOnceWith("test", "1,2,3")).toBeTruthy();
});

test("show initial value", async () => {
  // Arrange
  render(<GameEditor defaultName="name" defaultPoints="1,2,3" />);

  // Act

  // Assert
  expect(screen.getByLabelText<HTMLInputElement>("Name").value).toEqual("name");
  expect(screen.getByLabelText<HTMLInputElement>("Points").value).toEqual("1,2,3");
});

test("call cancel callback", async () => {
  // Arrange
  const fake = sinon.fake();
  render(<GameEditor defaultName="name" defaultPoints="1,2,3" onCancel={fake} />);

  // Act
  await userEvent.click(screen.getByText("Cancel"));

  // Assert
  expect(fake.calledOnce).toBe(true);
});

test("do not callback if validation returns specific error", async () => {
  // Arrange
  const submit = sinon.fake();
  render(<GameEditor defaultName="name" defaultPoints="1,2,3" onSubmit={submit} errors={["NameConflicted"]} />);

  // Act

  // Assert
  expect(screen.getByLabelText<HTMLInputElement>("Name").value).toEqual("name");
  expect(screen.getByLabelText<HTMLInputElement>("Points").value).toEqual("1,2,3");
  await userEvent.click(screen.getByText("Submit"));

  expect(submit.calledOnce).toBe(false);
});

test("call submit if custom callback returns no errors", async () => {
  // Arrange
  const submit = sinon.fake();
  render(<GameEditor defaultName="name" defaultPoints="1,2,3" onSubmit={submit} errors={[]} />);

  // Act

  // Assert
  expect(screen.getByLabelText<HTMLInputElement>("Name").value).toEqual("name");
  expect(screen.getByLabelText<HTMLInputElement>("Points").value).toEqual("1,2,3");
  await userEvent.click(screen.getByText("Submit"));

  expect(submit.calledOnce).toBe(true);
});
