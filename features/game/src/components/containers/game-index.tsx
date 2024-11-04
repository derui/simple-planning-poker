import { hooks } from "../../hooks/facade.js";
import { GameIndexLayout } from "./game-index.layout.js";

interface Props {
  /**
   * Handler to notify start voting to page.
   */
  onStartVoting?: (votingId: string) => void;
}

// eslint-disable-next-line func-style
export function GameIndex({ onStartVoting }: Props): JSX.Element {
  const { loading, games, startVoting } = hooks.useListGames();

  const handleStartVoting = (gameId: string) => {
    startVoting(gameId, onStartVoting);
  };

  return <GameIndexLayout games={games} loading={loading == "loading"} onStartVoting={handleStartVoting} />;
}
