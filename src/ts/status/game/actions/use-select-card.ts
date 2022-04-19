import { useRecoilCallback, useRecoilValue } from "recoil";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import currentGamePlayerState from "../atoms/current-game-player-state";
import currentGameState from "../selectors/current-game-state";

export default function createUseSelectCard(registrar: ApplicationDependencyRegistrar) {
  const handCardUseCase = registrar.resolve("handCardUseCase");

  return () => {
    const currentPlayer = useRecoilValue(currentGamePlayerState);
    const currentGame = useRecoilValue(currentGameState).valueMaybe();

    return useRecoilCallback(() => async (index: number) => {
      if (!currentPlayer || !currentGame) {
        return;
      }
      const card = currentGame.viewModel.cards[index];

      await handCardUseCase.execute({
        playerId: currentPlayer.id,
        card,
      });
    });
  };
}
