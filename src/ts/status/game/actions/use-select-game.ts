import { GameId } from "@/domains/game";
import { setCurrentGameIdState } from "../atoms/current-game-id-state";

export const createUseSelectGame = function () {
  return () => (gameId: GameId) => setCurrentGameIdState(gameId);
};
