import { useRecoilCallback, useRecoilValue } from "recoil";
import { Id } from "@/domains/game";
import { InvitationSignature } from "@/domains/invitation";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentGamePlayerState from "../atoms/current-game-player-state";
import { gamePlayerToViewModel } from "../dxo";
import currentUserState from "@/status/user/atoms/current-user-state";

export default function createUseJoinUser(registrar: DependencyRegistrar<Dependencies>) {
  const gameRepository = registrar.resolve("gameRepository");
  const gamePlayerRepository = registrar.resolve("gamePlayerRepository");
  const joinUserUseCase = registrar.resolve("joinUserUseCase");

  return () => {
    const currentUser = useRecoilValue(currentUserState);

    return useRecoilCallback(({ set }) => async (signature: InvitationSignature, callback: (id: Id) => void) => {
      if (!currentUser.id) {
        return;
      }

      const ret = await joinUserUseCase.execute({
        userId: currentUser.id,
        signature,
      });

      if (ret.kind === "success") {
        const gamePlayer = await gamePlayerRepository.findBy(ret.gamePlayerId);
        set(currentGamePlayerState, (prev) => {
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
    });
  };
}
