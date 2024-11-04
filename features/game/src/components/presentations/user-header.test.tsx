import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { VoterMode } from "../type.js";
import { UserHeader } from "./user-header.js";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(<UserHeader userName="name" defaultVoterMode={VoterMode.Normal} />);

  expect(ret.container).toMatchSnapshot();
});

test("should call callback when mode icon clicked", async () => {
  // Arrange
  const callback = sinon.fake();
  const ret = render(
    <UserHeader userName="name" defaultVoterMode={VoterMode.Normal} onChangeDefaultVoterMode={callback} />
  );

  // Act
  await userEvent.click(ret.getByRole("button", { name: "Toggle voter mode" }));

  // Assert
  expect(callback.calledWith(VoterMode.Inspector)).toBeTruthy();
});

test("should call callback when user name change button clicked", async () => {
  // Arrange
  const callback = sinon.fake();
  const ret = render(
    <UserHeader userName="name" defaultVoterMode={VoterMode.Normal} onRequestUserNameEdit={callback} />
  );

  // Act
  await userEvent.click(ret.getByRole("button", { name: "Edit user name" }));

  // Assert
  expect(callback.calledWith()).toBeTruthy();
});
