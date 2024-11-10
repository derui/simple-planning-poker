import { useCallback, useState } from "react";
import { GameDto } from "../../atoms/dto.js";
import { GameDetail } from "../presentations/game-detail.js";
import { GameEditor } from "../presentations/game-editor.js";
import * as styles from "./game-detail.css.js";

export interface Props {
  readonly game?: GameDto;

  /**
   * A status to show if the game is being edited
   */
  readonly editing?: boolean;

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
  editing,
}: Props): JSX.Element {
  const [mode, setMode] = useState<"editing" | "viewing">("viewing");

  const handleDelete = useCallback(() => {
    if (game) {
      onDelete?.(game.id);
    }
  }, [game, onDelete]);

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
      }
    },
    [game, onSubmit]
  );

  return (
    <div className={styles.root}>
      (mode === 'editing' ?{" "}
      <GameEditor defaultName={game?.name} defaultPoints={game?.points} onSubmit={handleSubmit} loading={editing} /> :
      <GameDetail
        name={game?.name}
        points={game?.points}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onStartVoting={handleStartVoting}
      />
      )
    </div>
  );
};
