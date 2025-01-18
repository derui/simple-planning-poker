import { useCallback } from "react";
import { GameDetailLayout } from "./game-detail.layout.js";

import { useCurrentGame } from "../../atoms/use-current-game.js";
import { useEditGame } from "../../atoms/use-edit-game.js";

interface Props {
  /**
   *  Notify the parent that the game has been voted.
   */
  onStartVoting?: (gameId: string) => void;
}

export const GameDetail = function GameDetail({ onStartVoting }: Props): JSX.Element {
  const { loading, delete: _delete, game } = useCurrentGame();
  const { edit, loading: editing } = useEditGame();

  const handleDelete = useCallback(() => {
    _delete();
  }, [_delete]);

  const handleStartVoting = useCallback(() => {
    if (game) {
      onStartVoting?.(game?.id);
    }
  }, [game, onStartVoting]);

  const handleSubmit = useCallback(
    (name: string, points: string) => {
      edit(name, points);
    },
    [edit]
  );

  return (
    <GameDetailLayout
      game={game}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onStartVoting={handleStartVoting}
      loading={loading || editing}
    />
  );
};
