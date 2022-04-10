import { useRecoilCallback } from "recoil";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { useCurrentGameState } from "../selectors";

export default function createUseShowDown(registrar: DependencyRegistrar<Dependencies>) {
  const showDownUseCase = registrar.resolve("showDownUseCase");

  return () => {
    const currentGame = useCurrentGameState();

    return useRecoilCallback(() => async () => {
      if (!currentGame) {
        return;
      }

      await showDownUseCase.execute({
        gameId: currentGame.id,
      });
    });
  };
}
