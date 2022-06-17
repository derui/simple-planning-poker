import { authenticatingState } from "./authenticating-state";
import { setSigninState } from "../atoms/signin-state";
import { createRoot } from "solid-js";

test("user is not authenticating if state is default", async () =>
  createRoot((dispose) => {
    const value = authenticatingState();
    expect(value).toBe(false);
    dispose();
  }));

test("get authenticating", async () =>
  createRoot((dispose) => {
    setSigninState((prev) => ({ ...prev, authenticating: true }));

    const value = authenticatingState();
    expect(value).toBe(true);
    dispose();
  }));
