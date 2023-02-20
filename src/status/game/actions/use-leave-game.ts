import { useRecoilCallback, useRecoilValue } from "recoil";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentGamePlayerState from "../atoms/current-game-player-state";
import currentGameState from "../selectors/current-game-state";
import currentGameIdState from "../atoms/current-game-id-state";
import currentUserState from "@/status/user/atoms/current-user-state";

export default function createUseLeaveGame(registrar: DependencyRegistrar<Dependencies>) {
  const userRepository = registrar.resolve("userRepository");
  const leaveGameUseCase = registrar.resolve("leaveGameUseCase");

  return () => {
    const currentUser = useRecoilValue(currentUserState);
    const currentGame = useRecoilValue(currentGameState).valueMaybe()?.viewModel;

    return useRecoilCallback(({ set }) => async () => {
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

      set(currentUserState, (prev) => {
        return { ...prev, joinedGames: prev.joinedGames.filter((v) => v.id !== currentGame.id) };
      });
      set(currentGamePlayerState, undefined);
      set(currentGameIdState, undefined);
    });
  };
}
