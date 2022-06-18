import { ApplicationDependencyRegistrar } from "@/dependencies";
import { currentGamePlayerState } from "../signals/current-game-player-state";
import { gameStore } from "../signals/game-query";

export const createUseSelectCard = function (registrar: ApplicationDependencyRegistrar) {
  const handCardUseCase = registrar.resolve("handCardUseCase");

  return () => async (index: number) => {
    const currentPlayer = currentGamePlayerState();
    const currentGame = gameStore?.viewModel;
    if (!currentPlayer || !currentGame) {
      return;
    }
    const card = currentGame.cards[index];

    await handCardUseCase.execute({
      playerId: currentPlayer.id,
      card,
    });
  };
};
