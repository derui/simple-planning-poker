import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { gameStore } from "../signals/game-query";

export const createUseShowDown = function (registrar: DependencyRegistrar<Dependencies>) {
  const showDownUseCase = registrar.resolve("showDownUseCase");

  return () => async () => {
    const game = gameStore.viewModel;
    if (!game) {
      return;
    }

    await showDownUseCase.execute({
      gameId: game.id,
    });
  };
};
