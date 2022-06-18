import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { useCurrentGameState } from "../selectors";

export const createUseShowDown = function (registrar: DependencyRegistrar<Dependencies>) {
  const showDownUseCase = registrar.resolve("showDownUseCase");

  return () => async () => {
    const currentGame = useCurrentGameState();
    const game = currentGame.valueMaybe()?.viewModel;
    if (!game) {
      return;
    }

    await showDownUseCase.execute({
      gameId: game.id,
    });
  };
};
