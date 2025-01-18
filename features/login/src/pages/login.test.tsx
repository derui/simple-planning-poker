import { resetLoggedInUser } from "@spp/infra-authenticator/memory";
import * as Url from "@spp/shared-app-url";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { afterEach, beforeEach, expect, test } from "vitest";
import { LoginPage } from "./login.js";

afterEach(cleanup);
beforeEach(clear);
beforeEach(resetLoggedInUser);

test("render page", async () => {
  const store = createStore();

  render(
    <Provider store={store}>
      <LoginPage onLogined={sinon.fake()} />
    </Provider>
  );

  expect((await screen.findByText<HTMLAnchorElement>("Sign In")).href).toContain(Url.signInPage());
  expect((await screen.findByText<HTMLAnchorElement>("Sign Up")).href).toContain(Url.signUpPage());
});

test("invoke callback after logined", async () => {
  // Arrange
  const callback = sinon.fake();

  // Act
  render(<LoginPage onLogined={callback} />);
  await act(async () => {});

  await userEvent.click(screen.getByText("Sign Up"));
  await userEvent.type(screen.getByPlaceholderText(/yourname/), "test@example.com");
  await userEvent.type(screen.getByPlaceholderText(/Password/), "password");
  await userEvent.click(screen.getByText("Submit"));

  await act(async () => {});

  // Assert
  expect(callback.callCount).toEqual(1);
});
