import { snapshot_UNSTABLE } from "recoil";
import currentGameInformationState from "./current-game-information-state";

test("return default values if current game is not found", async () => {
  const snapshot = snapshot_UNSTABLE();
  const value = snapshot.getLoadable(currentGameInformationState).valueOrThrow();
  expect(value.name).toBeUndefined();
  expect(value.cards).toHaveLength(0);
  expect(value.invitationSignature).toBeUndefined();
});
