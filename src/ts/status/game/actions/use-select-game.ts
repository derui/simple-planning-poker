import { GameId } from "@/domains/game";
import { setCurrentGameIdState } from "../signals/current-game-id-state";

export const createUseSelectGame = function () {
  return () => (gameId: GameId) => setCurrentGameIdState(gameId);
};
