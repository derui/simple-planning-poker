import { createRoot } from "solid-js";
import { setCurrentUserState } from "../signals/current-user-state";
import { currentUserNameState } from "./current-user-name-state";

test("return empty string if user is not logged in", () =>
  createRoot((dispose) => {
    const value = currentUserNameState();
    expect(value).toBe("");
    dispose();
  }));

test("return user name if user is logged in", () =>
  createRoot((dispose) => {
    setCurrentUserState((prev) => ({ ...prev, name: "foobar" }));

    const value = currentUserNameState();

    expect(value).toBe("foobar");
    dispose();
  }));
