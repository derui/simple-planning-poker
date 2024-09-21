import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SignUp } from "./signup.js";
import { createStore, Provider } from "jotai";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import sinon from "sinon";
import { gameIndexPage } from "@spp/shared-app-url";

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

test("navigate game if user already logined", async () => {
  // Arrange
  const signUpFake = sinon.fake();
  const mock: Hooks = {
    useLogin() {
      return {
        signIn: sinon.fake(),
        signUp: sinon.fake(),
        status: "logined",
        loginError: undefined,
      };
    },
    useAuth: sinon.fake(),
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <MemoryRouter>
        <Routes>
          <Route path={gameIndexPage()} element={"Game"} />
          <Route path="/" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    </ImplementationProvider>
  );

  await waitFor(() => Promise.resolve());

  // Assert
  expect(screen.getByText("Game")).not.toBeNull();
});
