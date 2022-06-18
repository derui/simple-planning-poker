import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { setCurrentGamePlayerState } from "../signals/current-game-player-state";
import { setCurrentGameIdState } from "../signals/current-game-id-state";
import { currentUserState, setCurrentUserState } from "@/status/user/signals/current-user-state";
import { gameStore } from "../signals/game-query";

export const createUseLeaveGame = function (registrar: DependencyRegistrar<Dependencies>) {
  const userRepository = registrar.resolve("userRepository");
  const leaveGameUseCase = registrar.resolve("leaveGameUseCase");

  return () => async () => {
    const currentUser = currentUserState();
    const currentGame = gameStore.viewModel;
    if (!currentUser?.id || !currentGame) {
      return;
    }
    const user = await userRepository.findBy(currentUser.id);
    if (!user) {
      return;
    }

    await leaveGameUseCase.execute({
      gameId: currentGame.id,
      userId: user.id,
    });

    setCurrentUserState((prev) => {
      return { ...prev, joinedGames: prev.joinedGames.filter((v) => v.id !== currentGame.id) };
    });
    setCurrentGamePlayerState(undefined);
    setCurrentGameIdState(undefined);
  };
};
