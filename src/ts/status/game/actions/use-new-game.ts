import { useRecoilCallback } from "recoil";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentGameState from "../selectors/current-game-state";

export default function createUseNewGame(registrar: DependencyRegistrar<Dependencies>) {
  const newGameUseCase = registrar.resolve("newGameUseCase");

  return () => {
    const currentGame = currentGameState();

    return useRecoilCallback(() => async () => {
      if (!currentGame) {
        return;
      }

      await newGameUseCase.execute({
        gameId: currentGame.id,
      });
    });
  };
}
