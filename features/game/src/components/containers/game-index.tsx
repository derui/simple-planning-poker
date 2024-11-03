import { hooks } from "../../hooks/facade.js";
import { GameIndexLayout } from "./game-index.layout.js";

// eslint-disable-next-line func-style
export function GameIndex(): JSX.Element {
  const { loading, games } = hooks.useListGames();

  return <GameIndexLayout games={games} loading={loading == "loading"} />;
}
