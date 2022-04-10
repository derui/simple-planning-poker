import { snapshot_UNSTABLE } from "recoil";
import currentGameStatusState from "./current-game-status-state";

test("return empty status", () => {
  const snapshot = snapshot_UNSTABLE();
  const value = snapshot.getLoadable(currentGameStatusState).valueOrThrow();
  expect(value).toBe("EmptyUserHand");
});
