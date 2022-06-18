import { UserMode } from "@/domains/game-player";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { currentGamePlayerState, setCurrentGamePlayerState } from "../atoms/current-game-player-state";

export const createUseChangeUserMode = function (registrar: DependencyRegistrar<Dependencies>) {
  const changeUserModeUseCase = registrar.resolve("changeUserModeUseCase");

  return () => async (mode: UserMode) => {
    const currentPlayer = currentGamePlayerState();
    if (!currentPlayer) {
      return;
    }

    await changeUserModeUseCase.execute({
      gamePlayerId: currentPlayer.id,
      mode,
    });

    setCurrentGamePlayerState((prev) => {
      if (!prev) {
        return prev;
      }

      return { ...prev, mode };
    });
  };
};
