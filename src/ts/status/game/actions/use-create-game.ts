import { GameId } from "@/domains/game";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import { setCurrentGamePlayerState } from "../atoms/current-game-player-state";
import { gamePlayerToViewModel } from "../dxo";
import { currentUserState } from "@/status/user/atoms/current-user-state";

interface CreationParameter {
  name: string;
  cards: number[];
  callback: (gameId: GameId) => void;
}

export const createUseCreateGame = function (registrar: ApplicationDependencyRegistrar) {
  const gamePlayerRepository = registrar.resolve("gamePlayerRepository");
  const useCase = registrar.resolve("createGameUseCase");

  return () =>
    async ({ name, cards, callback }: CreationParameter) => {
      const currentUser = currentUserState();
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

        setCurrentGamePlayerState((prev) => {
          return player ? gamePlayerToViewModel(player, currentUser.name) : prev;
        });
        callback(ret.gameId);
      }
    };
};
