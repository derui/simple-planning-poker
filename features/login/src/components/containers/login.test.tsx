import { cleanup, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { AuthStatus } from "../../atoms/use-auth.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { Login } from "./login.js";

afterEach(cleanup);

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
        <Login />
      </Provider>
    </ImplementationProvider>
  );

  expect(screen.getByText("Sign In").tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign In").href).toContain("/signin");
  expect(screen.getByText(/Sign Up/).tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign Up").href).toContain("/signup");
});

test("render page while checking", () => {
  const store = createStore();

  const mock: Hooks = {
    useLogin: sinon.fake(),
    useAuth() {
      return {
        status: AuthStatus.Checking,
        checkLogined: sinon.fake(),
        logout: sinon.fake(),
      };
    },
  };

  render(
    <ImplementationProvider implementation={mock}>
      <Provider store={store}>
        <Login />
      </Provider>
    </ImplementationProvider>
  );

  expect(screen.queryByText("Sign In")).toBeNull();
  expect(screen.queryByText("Sign Up")).toBeNull();
}); //
