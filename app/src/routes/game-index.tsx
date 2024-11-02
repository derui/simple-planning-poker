import { GameIndex, hooks } from "@spp/feature-game";
import { useEffect } from "react";

/**
 * Route for voting area
 */
export const GameIndexRoute = function GameIndexRoute(): JSX.Element {
  const prepare = hooks.usePrepareGame();

  useEffect(() => {
    prepare.prepare();
  }, []);

  return <GameIndex />;
};
