import { clear } from "@spp/shared-domain/mock/user-repository";
import { cleanup, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { afterEach, beforeEach, expect, test } from "vitest";
import { Login } from "./login.js";

afterEach(cleanup);
beforeEach(clear);

test("render page", () => {
  const store = createStore();

  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  expect(screen.getByText("Sign In").tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign In").href).toContain("/signin");
  expect(screen.getByText(/Sign Up/).tagName.toLowerCase()).toEqual("a");
  expect(screen.getByText<HTMLAnchorElement>("Sign Up").href).toContain("/signup");
});
