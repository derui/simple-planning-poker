import { useRecoilCallback } from "recoil";
import { Id } from "@/domains/game";
import currentGameIdState from "../atoms/current-game-id-state";

export default function createUseSelectGame() {
  return () =>
    useRecoilCallback(
      ({ set }) =>
        (gameId: Id) =>
          set(currentGameIdState, gameId)
    );
}
