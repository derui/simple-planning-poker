import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { SignUpPage } from "./signup";
import { createPureStore } from "@/status/store";
import { signUp } from "@/status/actions/signin";

afterEach(cleanup);

test("render page", () => {
  const store = createPureStore();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByTestId("signin/root")).not.toBeNull();
});

test("dispatch event after submit", async () => {
  expect.assertions(1);
  const store = createPureStore();

  store.replaceReducer((state, action) => {
    if (signUp.match(action)) {
      expect(action.payload).toEqual({ email: "email", password: "password" });
    }

    return state!!;
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    </Provider>
  );

  await userEvent.type(screen.getByPlaceholderText("e.g. yourname@yourdomain.com"), "email");
  await userEvent.type(screen.getByPlaceholderText("Password"), "password");
  await userEvent.click(screen.getByText("Submit"));
});
