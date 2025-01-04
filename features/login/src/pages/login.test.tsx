import { resetLoggedInUser } from "@spp/infra-authenticator/memory";
import * as Url from "@spp/shared-app-url";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { afterEach, beforeEach, expect, test } from "vitest";
import { AuthStatus } from "../atoms/type.js";
import { useAuth } from "../atoms/use-auth.js";
import { useLogin } from "../atoms/use-login.js";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import { LoginPage } from "./login.js";

afterEach(cleanup);
beforeEach(clear);
beforeEach(resetLoggedInUser);

test("render page", () => {
  const store = createStore();

  const mock: Hooks = {
    useLogin: sinon.fake(),
    useAuth() {
      return {
        status: AuthStatus.NotAuthenticated,
        checkLogined: sinon.fake(),
        logout: sinon.fake(),
      };
    },
  };

  render(
    <ImplementationProvider implementation={mock}>
      <Provider store={store}>
        <LoginPage onLogined={sinon.fake()} />
      </Provider>
    </ImplementationProvider>
  );

  expect(screen.getByText("Sign In").tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign In").href).toContain(Url.signInPage());
  expect(screen.getByText(/Sign Up/).tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign Up").href).toContain(Url.signUpPage());
});

test("call hook on mount", async () => {
  // Arrange
  const checkFake = sinon.fake();
  const mock: Hooks = {
    useLogin: sinon.fake(),
    useAuth() {
      return {
        status: AuthStatus.NotAuthenticated,
        checkLogined: checkFake,
        logout: sinon.fake(),
      };
    },
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <LoginPage onLogined={sinon.fake()} />
    </ImplementationProvider>
  );

  await waitFor(() => Promise.resolve());

  // Assert
  expect(checkFake.callCount).toEqual(1);
});

test("dont call hook twice", async () => {
  // Arrange
  const checkFake = sinon.fake();
  const mock: Hooks = {
    useLogin: sinon.fake(),
    useAuth() {
      return {
        status: AuthStatus.NotAuthenticated,
        checkLogined: checkFake,
        logout: sinon.fake(),
      };
    },
  };

  // Act
  const container = render(
    <ImplementationProvider implementation={mock}>
      <LoginPage onLogined={sinon.fake()} />
    </ImplementationProvider>
  );
  await waitFor(() => Promise.resolve());

  container.rerender(
    <ImplementationProvider implementation={mock}>
      <LoginPage onLogined={sinon.fake()} />
    </ImplementationProvider>
  );
  await waitFor(() => Promise.resolve());

  // Assert
  expect(checkFake.callCount).toEqual(1);
});

test("invoke callback after authenticated", async () => {
  // Arrange
  const callback = sinon.fake();
  const mock: Hooks = {
    useLogin: sinon.fake(),
    useAuth() {
      return {
        status: AuthStatus.Authenticated,
        checkLogined: sinon.fake(),
        logout: sinon.fake(),
      };
    },
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <LoginPage onLogined={callback} />
    </ImplementationProvider>
  );

  await waitFor(() => Promise.resolve());

  // Assert
  expect(callback.callCount).toEqual(1);
});

test("invoke callback after logined", async () => {
  // Arrange
  const callback = sinon.fake();
  const mock: Hooks = {
    useLogin: useLogin,
    useAuth: useAuth,
  };

  // Act
  render(
    <ImplementationProvider implementation={mock}>
      <LoginPage onLogined={callback} />
    </ImplementationProvider>
  );
  await act(async () => {});

  await userEvent.click(screen.getByText("Sign Up"));
  await userEvent.type(screen.getByPlaceholderText(/yourname/), "test@example.com");
  await userEvent.type(screen.getByPlaceholderText(/Password/), "password");
  await userEvent.click(screen.getByText("Submit"));

  await act(async () => {});

  // Assert
  expect(callback.callCount).toEqual(1);
});
