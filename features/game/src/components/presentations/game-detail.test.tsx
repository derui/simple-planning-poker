import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { GameDetail } from "./game-detail.js";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<GameDetail name="name" points="points" />);

  expect(ret.container).toMatchSnapshot();
});

test("should call callback onEdit when edit button is clicked", async () => {
  // Arrange
  const mockCallback = Sinon.fake();
  render(<GameDetail name="name" points="points" onEdit={mockCallback} />);

  // Act
  await userEvent.click(screen.getByLabelText("Edit"));

  // Assert
  expect(mockCallback.calledOnce).toBeTruthy();
});

test("should call callback onDelete when delete button is clicked", async () => {
  // Arrange
  const mockCallback = Sinon.fake();
  render(<GameDetail name="name" points="points" onDelete={mockCallback} />);

  // Act
  await userEvent.click(screen.getByRole("button", { name: "Delete" }));

  // Assert
  expect(mockCallback.calledOnce).toBeTruthy();
});

test("should call callback onStartVoting where start voting button is clicked", async () => {
  // Arrange
  const mockCallback = Sinon.fake();
  render(<GameDetail name="name" points="points" onStartVoting={mockCallback} />);

  // Act
  await userEvent.click(screen.getByRole("button", { name: "Start Voting" }));

  // Assert
  expect(mockCallback.calledOnce).toBeTruthy();
});

test("should show empty if name is not passed", () => {
  // Arrange
  render(<GameDetail />);

  // Act

  // Assert
  expect(screen.queryByText(/Select game/)).not.toBeNull();
});
