import { gameIndexPage } from "@spp/shared-app-url";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { SignIn } from "./signin.js";

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
          <SignIn />
        </MemoryRouter>
      </Provider>
    </ImplementationProvider>
  );

  expect(screen.getByRole("main")).not.toBeNull();
  expect(screen.queryByText(/Sign In/)).not.toBeNull();
});

test("call hook after submit", async () => {
  // Arrange
  const signInFake = sinon.fake();
  const mock: Hooks = {
    useLogin() {
      return {
        signIn: signInFake,
        signUp: sinon.fake(),
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
        <SignIn />
      </MemoryRouter>
    </ImplementationProvider>
  );

  await userEvent.type(screen.getByPlaceholderText("e.g. yourname@yourdomain.com"), "email");
  await userEvent.type(screen.getByPlaceholderText("Password"), "password");
  await userEvent.click(screen.getByText("Submit"));

  // Assert
  expect(signInFake.lastCall.args).toEqual(["email", "password"]);
});

test("navigate game if user already logined", async () => {
  // Arrange
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
          <Route path="/" element={<SignIn />} />
        </Routes>
      </MemoryRouter>
    </ImplementationProvider>
  );

  await waitFor(() => Promise.resolve());

  // Assert
  expect(screen.getByText("Game")).not.toBeNull();
});
