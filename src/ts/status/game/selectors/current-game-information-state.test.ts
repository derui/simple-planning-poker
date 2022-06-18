import { createRoot } from "solid-js";
import { currentGameInformationState } from "./current-game-information-state";

test("return default values if current game is not found", () =>
  createRoot((dispose) => {
    const value = currentGameInformationState();
    expect(value.name).toBeUndefined();
    expect(value.cards).toHaveLength(0);
    expect(value.invitationSignature).toBeUndefined();
    dispose();
  }));
