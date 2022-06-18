import { authenticatedState } from "./authenticated-state";
import { createRoot } from "solid-js";
import { setSignInState } from "@/status/signin/signals/signin-state";

test("user is not authenticated if state is default", async () =>
  createRoot((dispose) => {
    const value = authenticatedState();
    expect(value()).toBe(false);
    dispose();
  }));

test("user is authenticated if user is setted", async () =>
  createRoot((dispose) => {
    setSignInState((prev) => ({ ...prev, authenticated: true }));

    const value = authenticatedState();
    expect(value()).toBe(true);
    dispose();
  }));
