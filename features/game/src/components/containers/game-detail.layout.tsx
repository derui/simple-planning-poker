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
  readonly onDelete: () => void;

  /**
   * A handler to request to edit the game
   */
  readonly onSubmit: (name: string, points: string) => void;

  /**
   *  A handler to start voting for the game
   */
  readonly onStartVoting: () => void;
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
    onDelete?.();
  };

  const handleEdit = () => setMode("editing");

  const handleStartVoting = useCallback(() => {
    onStartVoting?.();
  }, [onStartVoting]);

  const handleSubmit = useCallback<(name: string, points: string) => void>(
    (name, points) => {
      onSubmit?.(name, points);
      setMode("viewing");
    },
    [onSubmit]
  );

  const handleCancel = useCallback(() => {
    setMode("viewing");
  }, []);

  return (
    <div className={styles.root}>
      {mode === "editing" ? (
        <GameEditor
          defaultName={game?.name}
          defaultPoints={game?.points}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={handleCancel}
        />
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
