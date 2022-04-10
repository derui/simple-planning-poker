import { useRecoilCallback, useRecoilValue } from "recoil";
import { UserMode } from "@/domains/game-player";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentGamePlayerState from "../atoms/current-game-player-state";

export default function createUseChangeUserMode(registrar: DependencyRegistrar<Dependencies>) {
  const changeUserModeUseCase = registrar.resolve("changeUserModeUseCase");

  return () => {
    const currentPlayer = useRecoilValue(currentGamePlayerState);

    return useRecoilCallback(({ set }) => async (mode: UserMode) => {
      if (!currentPlayer) {
        return;
      }

      await changeUserModeUseCase.execute({
        gamePlayerId: currentPlayer.id,
        mode,
      });

      set(currentGamePlayerState, (prev) => {
        if (!prev) {
          return prev;
        }

        return { ...prev, mode };
      });
    });
  };
}
