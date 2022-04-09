import { snapshot_UNSTABLE } from "recoil";
import signInState from "../atoms/signing";
import authenticating from "./authenticating";

test("user is not authenticating if state is default", () => {
  const snapshot = snapshot_UNSTABLE();

  expect(snapshot.getLoadable(authenticating).valueOrThrow()).toBe(false);
});

test("get authenticating", () => {
  const snapshot = snapshot_UNSTABLE(({ set }) => set(signInState, (prev) => ({ ...prev, authenticating: true })));

  expect(snapshot.getLoadable(authenticating).valueOrThrow()).toBe(true);
});
