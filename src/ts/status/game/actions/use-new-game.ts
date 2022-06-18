import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { gameStore } from "../signals/game-query";

export const createUseNewGame = function (registrar: DependencyRegistrar<Dependencies>) {
  const newGameUseCase = registrar.resolve("newGameUseCase");

  return () => async () => {
    const currentGame = gameStore?.viewModel;
    if (!currentGame) {
      return;
    }

    await newGameUseCase.execute({
      gameId: currentGame.id,
    });
  };
};
