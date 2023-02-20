import { snapshot_UNSTABLE } from "recoil";
import authenticatingState from "./authenticating-state";
import signInState from "../atoms/signin-state";

test("user is not authenticating if state is default", async () => {
  const snapshot = snapshot_UNSTABLE();

  const value = snapshot.getLoadable(authenticatingState).valueOrThrow();
  expect(value).toBe(false);
});

test("get authenticating", async () => {
  const snapshot = snapshot_UNSTABLE(({ set }) => {
    set(signInState, (prev) => ({ ...prev, authenticating: true }));
  });

  const value = snapshot.getLoadable(authenticatingState).valueOrThrow();
  expect(value).toBe(true);
});
