import { useCallback } from "react";
import { GameEditor } from "../presentations/game-editor.js";
import * as styles from "./game-detail.css.js";

export interface Props {
  /**
   * A status to show if some operation is doing
   */
  readonly loading?: boolean;

  /**
   * A handler to delete the game
   */
  readonly onCancel: () => void;

  /**
   * A handler to request to edit the game
   */
  readonly onSubmit: (name: string, points: string) => void;
}

export const GameCreatorLayout = function GameCreatorLayout({ onCancel, onSubmit, loading }: Props): JSX.Element {
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback<(name: string, points: string) => void>(
    (name, points) => {
      onSubmit?.(name, points);
    },
    [onSubmit]
  );

  return (
    <div className={styles.root}>
      <GameEditor onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
    </div>
  );
};
