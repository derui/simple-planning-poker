import { Game } from "@spp/shared-domain";
import { useCallback } from "react";
import { hooks } from "../../hooks/facade.js";
import { GameDetailLayout } from "./game-detail.layout.js";

interface Props {
  /**
   *  Notify the parent that the game has been voted.
   */
  onStartVoting?: (gameId: string) => void;
}

export const GameDetail = function GameDetail({ onStartVoting }: Props): JSX.Element {
  const { loading, delete: _delete, game } = hooks.useCurrentGame();
  const { edit } = hooks.useEditGame();

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
      loading={loading}
    />
  );
};
