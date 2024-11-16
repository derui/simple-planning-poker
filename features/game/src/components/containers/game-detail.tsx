import { hooks } from "../../hooks/facade.js";
import { GameDetailLayout } from "./game-detail.layout.js";

interface Props {
  /**
   *  Notify the parent that the game has been voted.
   */
  onStartVoting?: (gameId: string) => void;
}

export const GameDetail = function GameDetail({ onStartVoting }: Props): JSX.Element {
  const { loading, requestEdit, delete: _delete, game } = hooks.useGameDetail();

  const handleDelete = () => {
    _delete();
  };

  const handleSubmit = () => {
    requestEdit();
  };

  const handleStartVoting = (gameId: string) => {
    onStartVoting?.(gameId);
  };

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
