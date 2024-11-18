import { GameIndexLayout } from "./game-index.layout.js";

interface Props {
  /**
   * Handler to notify start voting to page.
   */
  onStartVoting?: (gameId: string) => void;
}

// eslint-disable-next-line func-style
export function GameIndex({ onStartVoting }: Props): JSX.Element {
  return <GameIndexLayout onStartVoting={onStartVoting} />;
}
