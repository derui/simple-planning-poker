import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { SignUp } from "./signup.js";

afterEach(cleanup);

test("render page", () => {
  const store = createStore();

  const mock: Hooks = {
    useLogin() {
      return {
        signIn: sinon.fake(),
        signUp: sinon.fake(),
        status: "notLogined",
        loginError: undefined,
      };
    },
    useAuth: sinon.fake(),
  };

  render(
    <ImplementationProvider implementation={mock}>
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  expect(screen.getByRole("main")).not.toBeNull();
  expect(screen.queryByText(/Sign Up/)).not.toBeNull();
});

test("call hook after submit", async () => {
  // Arrange
  const signUpFake = sinon.fake();
  const mock: Hooks = {
    useLogin() {
      return {
        signIn: sinon.fake(),
        signUp: signUpFake,
        status: "notLogined",
        loginError: undefined,
      };
    },
    useAuth: sinon.fake(),
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    </ImplementationProvider>
  );

  await userEvent.type(screen.getByPlaceholderText("e.g. yourname@yourdomain.com"), "email");
  await userEvent.type(screen.getByPlaceholderText("Password"), "password");
  await userEvent.click(screen.getByText("Submit"));

  // Assert
  expect(signUpFake.lastCall.args).toEqual(["email", "password"]);
});
