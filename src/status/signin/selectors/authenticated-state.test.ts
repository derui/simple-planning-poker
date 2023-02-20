import { MutableSnapshot, snapshot_UNSTABLE } from "recoil";
import authenticatedState from "./authenticated-state";
import signInState from "../atoms/signin-state";

test("user is not authenticated if state is default", async () => {
  const snapshot = snapshot_UNSTABLE();

  const value = snapshot.getLoadable(authenticatedState).valueOrThrow();
  expect(value).toBe(false);
});

test("user is authenticated if user is setted", async () => {
  const snapshot = snapshot_UNSTABLE(({ set }: MutableSnapshot) => {
    set(signInState, (prev) => ({ ...prev, authenticated: true }));
  });

  const value = snapshot.getLoadable(authenticatedState).valueOrThrow();
  expect(value).toBe(true);
});
