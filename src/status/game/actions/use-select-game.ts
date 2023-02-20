import { useRecoilCallback } from "recoil";
import { GameId } from "@/domains/game";
import currentGameIdState from "../atoms/current-game-id-state";

export default function createUseSelectGame() {
  return () =>
    useRecoilCallback(
      ({ set }) =>
        (gameId: GameId) =>
          set(currentGameIdState, gameId)
    );
}
