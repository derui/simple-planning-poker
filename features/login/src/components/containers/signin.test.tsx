import { clear } from "@spp/shared-domain/mock/user-repository";
import { cleanup, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { afterEach, beforeEach, expect, test } from "vitest";
import { SignIn } from "./signin.js";

afterEach(cleanup);
beforeEach(clear);

test("render page", () => {
  const store = createStore();

  render(
    <Provider store={store}>
      <SignIn />
    </Provider>
  );

  expect(screen.getByRole("main")).not.toBeNull();
  expect(screen.queryByText(/Sign In/)).not.toBeNull();
});
