import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { currentGameState } from "../selectors/current-game-state";

export const createUseNewGame = function (registrar: DependencyRegistrar<Dependencies>) {
  const newGameUseCase = registrar.resolve("newGameUseCase");

  return () => async () => {
    const currentGame = currentGameState().valueMaybe()?.viewModel;
    if (!currentGame) {
      return;
    }

    await newGameUseCase.execute({
      gameId: currentGame.id,
    });
  };
};
