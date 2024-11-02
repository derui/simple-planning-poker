import { PrepareGameStatus } from "../../atoms/game.js";
import { hooks } from "../../hooks/facade.js";
import { GameIndexLayout } from "./game-index.layout.js";

// eslint-disable-next-line func-style
export function GameIndex(): JSX.Element {
  const { games } = hooks.useListGame();
  const { status } = hooks.usePrepareGame();

  const loading = status != PrepareGameStatus.Prepared;

  return <GameIndexLayout games={games} loading={loading} />;
}
