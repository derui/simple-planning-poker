import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { setCurrentGamePlayerState } from "../atoms/current-game-player-state";
import { currentGameState } from "../selectors/current-game-state";
import { setCurrentGameIdState } from "../atoms/current-game-id-state";
import { currentUserState, setCurrentUserState } from "@/status/user/atoms/current-user-state";

export const createUseLeaveGame = function (registrar: DependencyRegistrar<Dependencies>) {
  const userRepository = registrar.resolve("userRepository");
  const leaveGameUseCase = registrar.resolve("leaveGameUseCase");

  return () => async () => {
    const currentUser = currentUserState();
    const currentGame = currentGameState().valueMaybe()?.viewModel;
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
