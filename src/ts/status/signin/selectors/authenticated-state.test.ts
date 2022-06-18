import { authenticatedState } from "./authenticated-state";
import { setSignInState } from "../signals/signin-state";
import { createRoot } from "solid-js";

test("user is not authenticated if state is default", async () =>
  createRoot((dispose) => {
    const value = authenticatedState();
    expect(value).toBe(false);
    dispose();
  }));

test("user is authenticated if user is setted", async () =>
  createRoot((dispose) => {
    setSignInState((prev) => ({ ...prev, authenticated: true }));

    const value = authenticatedState();
    expect(value).toBe(true);
    dispose();
  }));
