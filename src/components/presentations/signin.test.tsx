import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { SignIn } from "./signin";

afterEach(cleanup);

test("success render", () => {
  render(<SignIn authenticating={false} title="test" onSubmit={() => {}} />);

  expect(screen.getByTestId("header").textContent).toMatch(/test/);
  expect(screen.getByTestId("email")).toHaveProperty("value", "");
  expect(screen.getByTestId("password")).toHaveProperty("value", "");
});

test("render children", () => {
  render(
    <SignIn authenticating={false} title="test" onSubmit={() => {}}>
      <span data-testid="children">Child element</span>
    </SignIn>
  );

  expect(screen.getByTestId("children").textContent).toMatch(/Child element/);
});

test("get email and password on submit", async () => {
  expect.assertions(2);

  render(
    <SignIn
      authenticating={false}
      title="test"
      onSubmit={({ email, password }) => {
        expect(email).toBe("mail");
        expect(password).toBe("password");
      }}
    ></SignIn>
  );

  await userEvent.type(screen.getByTestId("email"), "mail");
  await userEvent.type(screen.getByTestId("password"), "password");
  await userEvent.click(screen.getByRole("button"));
});

test("disable submit while authenticating", async () => {
  render(<SignIn authenticating={true} title="test" onSubmit={() => {}}></SignIn>);

  expect((screen.getByRole("button") as HTMLInputElement).disabled).toBe(true);
});
