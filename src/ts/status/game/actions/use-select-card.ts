import { ApplicationDependencyRegistrar } from "@/dependencies";
import { currentGamePlayerState } from "../atoms/current-game-player-state";
import { currentGameState } from "../selectors/current-game-state";

export default function createUseSelectCard(registrar: ApplicationDependencyRegistrar) {
  const handCardUseCase = registrar.resolve("handCardUseCase");

  return () => async (index: number) => {
    const currentPlayer = currentGamePlayerState();
    const currentGame = currentGameState().valueMaybe();
    if (!currentPlayer || !currentGame) {
      return;
    }
    const card = currentGame.viewModel.cards[index];

    await handCardUseCase.execute({
      playerId: currentPlayer.id,
      card,
    });
  };
}
