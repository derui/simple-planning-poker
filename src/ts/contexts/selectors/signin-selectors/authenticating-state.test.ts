import { authenticatingState } from "./authenticating-state";
import { createRoot } from "solid-js";
import { setSignInState } from "@/status/signin/signals/signin-state";

test("user is not authenticating if state is default", async () =>
  createRoot((dispose) => {
    const value = authenticatingState();
    expect(value).toBe(false);
    dispose();
  }));

test("get authenticating", async () =>
  createRoot((dispose) => {
    setSignInState((prev) => ({ ...prev, authenticating: true }));

    const value = authenticatingState();
    expect(value).toBe(true);
    dispose();
  }));
