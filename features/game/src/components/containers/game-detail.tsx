import { useEffect, useState } from "react";
import { hooks } from "../../hooks/facade.js";
import { GameDetailLayout } from "./game-detail.layout.js";

interface Props {
  /**
   * Notify the parent that the game has been deleted.
   */
  onDelete?: () => void;

  /**
   *  Notify the parent that the game has been voted.
   */
  onStartVoting?: (gameId: string) => void;
}

export const GameDetail = function GameDetail({ onDelete, onStartVoting }: Props): JSX.Element {
  const [operation, setOperation] = useState<"edit" | "delete" | undefined>();
  const { status, edit, delete: _delete, game } = hooks.useGameDetail();

  useEffect(() => {
    if (status == "completed" && operation == "delete") {
      onDelete?.();
    }
  }, [status]);

  const handleDelete = () => {
    _delete();
    setOperation("delete");
  };

  const handleSubmit = (_gameId: string, name: string, points: string) => {
    edit(name, points);
    setOperation("edit");
  };

  const handleStartVoting = (gameId: string) => {
    onStartVoting?.(gameId);
  };

  const loading = status == "editing" || status == "deleting";

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
