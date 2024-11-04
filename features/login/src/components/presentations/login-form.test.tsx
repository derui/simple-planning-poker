import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import { LoginForm } from "./login-form.js";

afterEach(cleanup);

test("render page", () => {
  render(<LoginForm />);

  expect(screen.getByPlaceholderText(/yourname@yourdomain\.com/)).not.toBeNull();
  expect(screen.getByPlaceholderText("Password")).not.toBeNull();
});

test("dispatch event after submit", async () => {
  expect.assertions(2);

  const submit = (email: string, password: string) => {
    expect(email).toEqual("email");
    expect(password).toEqual("password");
  };

  render(<LoginForm onSubmit={submit} />);

  await userEvent.type(screen.getByPlaceholderText("e.g. yourname@yourdomain.com"), "email");
  await userEvent.type(screen.getByPlaceholderText("Password"), "password");
  await userEvent.click(screen.getByText("Submit"));
});

test("dispatch event after back", async () => {
  expect.assertions(1);

  render(
    <LoginForm
      onBack={() => {
        expect(true).toBeTruthy();
      }}
    />
  );

  await userEvent.type(screen.getByPlaceholderText("e.g. yourname@yourdomain.com"), "email");
  await userEvent.type(screen.getByPlaceholderText("Password"), "password");
  await userEvent.click(screen.getByText("Back"));
});
