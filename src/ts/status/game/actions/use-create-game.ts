import { useRecoilCallback, useRecoilValue } from "recoil";
import { GameId } from "@/domains/game";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import currentUserState from "@/status/signin/atoms/current-user";

interface CreationParameter {
  name: string;
  cards: number[];
  callback: (gameId: GameId) => void;
}

export default function createUseCreateGame(registrar: ApplicationDependencyRegistrar) {
  const gamePlayerRepository = registrar.resolve("gamePlayerRepository");
  const useCase = registrar.resolve("createGameUseCase");

  const { currentGamePlayer } = setUpAtomsInGame();
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
            set(currentGamePlayer, (prev) => {
              return player ? gamePlayerToViewModel(player) : prev;
            });
            callback(ret.gameId);
          }
        },
      [currentUser]
    );
  };
}
