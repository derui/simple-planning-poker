import { useRecoilCallback, useRecoilValue } from "recoil";
import { Id } from "@/domains/game";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import currentGamePlayerState from "../atoms/current-game-player-state";
import { gamePlayerToViewModel } from "../dxo";
import currentUserState from "@/status/user/atoms/current-user-state";

interface CreationParameter {
  name: string;
  cards: number[];
  callback: (gameId: Id) => void;
}

export default function createUseCreateGame(registrar: ApplicationDependencyRegistrar) {
  const gamePlayerRepository = registrar.resolve("gamePlayerRepository");
  const useCase = registrar.resolve("createGameUseCase");

  return () => {
    const currentUser = useRecoilValue(currentUserState);

    return useRecoilCallback(
      ({ set }) =>
        async ({ name, cards, callback }: CreationParameter) => {
          const currentUserId = currentUser.id;
          if (name === "" || cards.length === 0 || !currentUserId) {
            return;
          }

          const input = {
            name,
            points: cards,
            createdBy: currentUserId,
          };

          const ret = useCase.execute(input);
          if (ret.kind === "success") {
            const player = await gamePlayerRepository.findByUserAndGame(currentUserId, ret.gameId);

            set(currentGamePlayerState, (prev) => {
              return player ? gamePlayerToViewModel(player, currentUser.name) : prev;
            });
            callback(ret.gameId);
          }
        },
      [currentUser]
    );
  };
}
