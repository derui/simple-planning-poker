import * as Url from "@spp/shared-app-url";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { AuthStatus } from "../atoms/use-auth.js";
import { Hooks, ImplementationProvider } from "../hooks/facade.js";
import { LoginPage } from "./login.js";

afterEach(cleanup);

test.skip("render page", () => {
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
        <LoginPage />
      </Provider>
    </ImplementationProvider>
  );

  expect(screen.getByText("Sign In").tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign In").href).toContain(Url.signInPage());
  expect(screen.getByText(/Sign Up/).tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign Up").href).toContain(Url.signUpPage());
});

test.skip("call hook on mount", async () => {
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
      <Login />
    </ImplementationProvider>
  );

  await waitFor(() => Promise.resolve());

  // Assert
  expect(checkFake.callCount).toEqual(1);
});

test.skip("dont call hook twice", async () => {
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
      <Login />
    </ImplementationProvider>
  );
  await waitFor(() => Promise.resolve());

  container.rerender(
    <ImplementationProvider implementation={mock}>
      <Login />
    </ImplementationProvider>
  );
  await waitFor(() => Promise.resolve());

  // Assert
  expect(checkFake.callCount).toEqual(1);
});
