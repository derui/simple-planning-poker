import { useCallback, useState } from "react";
import { GameDto } from "../../atoms/dto.js";
import { GameDetail } from "../presentations/game-detail.js";
import { GameEditor } from "../presentations/game-editor.js";
import * as styles from "./game-detail.css.js";

export interface Props {
  readonly game?: GameDto;

  /**
   * A status to show if some operation is doing
   */
  readonly loading?: boolean;

  /**
   * A handler to delete the game
   */
  readonly onDelete: (gameId: string) => void;

  /**
   * A handler to request to edit the game
   */
  readonly onSubmit: (gameId: string, name: string, points: string) => void;

  /**
   *  A handler to start voting for the game
   */
  readonly onStartVoting: (gameId: string) => void;
}

export const GameDetailLayout = function GameDetailLayout({
  game,
  onDelete,
  onSubmit,
  onStartVoting,
  loading,
}: Props): JSX.Element {
  const [mode, setMode] = useState<"editing" | "viewing">("viewing");

  const handleDelete = () => {
    if (game) {
      onDelete?.(game.id);
    }
  };

  const handleEdit = () => setMode("editing");

  const handleStartVoting = useCallback(() => {
    if (game) {
      onStartVoting?.(game.id);
    }
  }, [game, onStartVoting]);

  const handleSubmit = useCallback<(name: string, points: string) => void>(
    (name, points) => {
      if (game) {
        onSubmit?.(game.id, name, points);
        setMode("viewing");
      }
    },
    [game, onSubmit]
  );

  return (
    <div className={styles.root}>
      {mode === "editing" ? (
        <GameEditor defaultName={game?.name} defaultPoints={game?.points} onSubmit={handleSubmit} loading={loading} />
      ) : (
        <GameDetail
          name={game?.name}
          points={game?.points}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStartVoting={handleStartVoting}
        />
      )}
    </div>
  );
};
