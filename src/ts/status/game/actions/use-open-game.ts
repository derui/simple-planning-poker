import { useRecoilCallback, useRecoilValue } from "recoil";
import { GameId } from "@/domains/game";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentUserState from "@/status/signin/atoms/current-user";
import currentGamePlayerState from "../atoms/current-game-player-state";
import { gamePlayerToViewModel } from "../dxo";

export default function createUseOpenGame(registrar: DependencyRegistrar<Dependencies>) {
  const userRepository = registrar.resolve("userRepository");
  const gamePlayerRepository = registrar.resolve("gamePlayerRepository");

  return () => {
    const currentUser = useRecoilValue(currentUserState);

    return useRecoilCallback(({ set }) => async (gameId: GameId, error: () => void) => {
      if (!currentUser.id) {
        error();
        return;
      }

      const user = await userRepository.findBy(currentUser.id);
      const joinedGame = user?.joinedGames?.find((v) => v.gameId === gameId) ?? undefined;
      if (!joinedGame) {
        error();
        return;
      }

      const gamePlayer = await gamePlayerRepository.findBy(joinedGame.playerId);
      set(currentGamePlayerState, (prev) => {
        return gamePlayer ? gamePlayerToViewModel(gamePlayer, currentUser.name) : undefined || prev;
      });
    });
  };
}
