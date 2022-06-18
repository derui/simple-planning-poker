import { GameId } from "@/domains/game";
import { InvitationSignature } from "@/domains/invitation";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { setCurrentGamePlayerState } from "../signals/current-game-player-state";
import { gamePlayerToViewModel } from "../dxo";
import { currentUserState } from "@/status/user/signals/current-user-state";

export const createUseJoinUser = function (registrar: DependencyRegistrar<Dependencies>) {
  const gameRepository = registrar.resolve("gameRepository");
  const gamePlayerRepository = registrar.resolve("gamePlayerRepository");
  const joinUserUseCase = registrar.resolve("joinUserUseCase");

  return () => async (signature: InvitationSignature, callback: (id: GameId) => void) => {
    const currentUser = currentUserState();
    if (!currentUser.id) {
      return;
    }

    const ret = await joinUserUseCase.execute({
      userId: currentUser.id,
      signature,
    });

    if (ret.kind === "success") {
      const gamePlayer = await gamePlayerRepository.findBy(ret.gamePlayerId);
      setCurrentGamePlayerState((prev) => {
        return gamePlayer ? gamePlayerToViewModel(gamePlayer, currentUser.name) : undefined || prev;
      });

      if (!gamePlayer) {
        return;
      }

      const game = await gameRepository.findBy(gamePlayer.game);

      if (game) {
        callback(game.id);
      }
    }
  };
};
