import { useCallback } from "react";
import { useCurrentGame } from "../../atoms/use-current-game.js";
import { useGames } from "../../atoms/use-games.js";
import { GameListLayout } from "./game-list.layout.js";

interface Props {
  /**
   * Callback to be called when a user requested to create a new game.
   */
  onCreate?: () => void;
}

export const GameList = function GameList({ onCreate }: Props): JSX.Element {
  const { games } = useGames();
  const { game, select } = useCurrentGame();

  const handleSelect = useCallback((gameId: string) => {
    select(gameId);
  }, []);

  const handleRequestCreate = useCallback(() => {
    onCreate?.();
  }, [onCreate]);

  return (
    <GameListLayout
      games={games}
      selectedGame={game?.id}
      onRequestCreate={handleRequestCreate}
      onSelect={handleSelect}
    />
  );
};
