import { createUserId } from "@/domains/user";
import { snapshot_UNSTABLE } from "recoil";
import currentUserState from "../atoms/current-user";
import authenticated from "./authenticated";

test("user is not  authenticated if state is default", () => {
  const snapshot = snapshot_UNSTABLE();

  expect(snapshot.getLoadable(authenticated).valueOrThrow()).toBe(false);
});

test("user is authenticated if user is setted", () => {
  const snapshot = snapshot_UNSTABLE(({ set }) =>
    set(currentUserState, (prev) => ({ ...prev, id: createUserId("1"), name: "name" }))
  );

  expect(snapshot.getLoadable(authenticated).valueOrThrow()).toBe(true);
});
