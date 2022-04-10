import { snapshot_UNSTABLE } from "recoil";
import currentUserState from "../atoms/current-user-state";
import currentUserNameState from "./current-user-name-state";

test("return empty string if user is not logged in", () => {
  const snapshot = snapshot_UNSTABLE();
  const value = snapshot.getLoadable(currentUserNameState).valueOrThrow();

  expect(value).toBe("");
});

test("return user name if user is logged in", () => {
  const snapshot = snapshot_UNSTABLE(({ set }) => {
    set(currentUserState, (prev) => {
      return { ...prev, name: "foobar" };
    });
  });
  const value = snapshot.getLoadable(currentUserNameState).valueOrThrow();

  expect(value).toBe("foobar");
});
