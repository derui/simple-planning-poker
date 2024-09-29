import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
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
