import { useRecoilCallback, useRecoilValue } from "recoil";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentGamePlayerState from "../atoms/current-game-player-state";
import currentGameState from "../selectors/current-game-state";
import currentUserState from "@/status/signin/atoms/current-user";
import currentGameIdState from "../atoms/current-game-id-state";

export default function createUseLeaveGame(registrar: DependencyRegistrar<Dependencies>) {
  const userRepository = registrar.resolve("userRepository");
  const leaveGameUseCase = registrar.resolve("leaveGameUseCase");

  return () => {
    const currentPlayer = useRecoilValue(currentGamePlayerState);
    const currentGame = currentGameState();

    return useRecoilCallback(({ set }) => async () => {
      if (!currentPlayer || !currentGame) {
        return;
      }
      const user = await userRepository.findBy(currentPlayer.userId);
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
