import { clear } from "@spp/shared-domain/mock/user-repository";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { afterEach, beforeEach, expect, test } from "vitest";
import { SignUp } from "./signup.js";

afterEach(cleanup);
beforeEach(clear);

test("render page", () => {
  const store = createStore();

  render(
    <Provider store={store}>
      <SignUp />
    </Provider>
  );

  expect(screen.getByRole("main")).not.toBeNull();
  expect(screen.queryByText(/Sign Up/)).not.toBeNull();
});

test("call hook after submit", async () => {
  // Arrange

  // Act
  const ret = render(<SignUp />);

  await userEvent.type(screen.getByPlaceholderText("e.g. yourname@yourdomain.com"), "email");
  await userEvent.type(screen.getByPlaceholderText("Password"), "password");
  await userEvent.click(screen.getByText("Submit"));

  // Assert
  expect(ret.container).toMatchSnapshot();
});
