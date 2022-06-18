import { GameId } from "@/domains/game";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { setCurrentGamePlayerState } from "../atoms/current-game-player-state";
import { gamePlayerToViewModel } from "../dxo";
import { currentUserState } from "@/status/user/atoms/current-user-state";
import { setCurrentGameIdState } from "../atoms/current-game-id-state";

export default function createUseOpenGame(registrar: DependencyRegistrar<Dependencies>) {
  const userRepository = registrar.resolve("userRepository");
  const gamePlayerRepository = registrar.resolve("gamePlayerRepository");

  return () => async (gameId: GameId, error: () => void) => {
    const currentUser = currentUserState();
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
    setCurrentGamePlayerState((prev) => {
      return gamePlayer ? gamePlayerToViewModel(gamePlayer, currentUser.name) : undefined || prev;
    });
    setCurrentGameIdState(gameId);
  };
}
