import { Game } from "@spp/shared-domain";
import { useCallback, useEffect } from "react";
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
  const { loading, delete: _delete, game, reload } = useCurrentGame();
  const { edit, loading: editing } = useEditGame();

  useEffect(() => {
    reload();
  }, [editing]);

  const handleDelete = useCallback(() => {
    _delete();
  }, [_delete]);

  const handleStartVoting = useCallback(
    (gameId: string) => {
      onStartVoting?.(gameId);
    },
    [onStartVoting]
  );

  const handleSubmit = useCallback(
    (gameId: string, name: string, points: string) => {
      edit(Game.createId(gameId), name, points);
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
