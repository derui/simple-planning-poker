import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import * as styles from "./game-detail.css.js";

export interface Props {
  readonly name?: string;

  readonly points?: string;

  /**
   * The callback to call when the user clicks on the edit button.
   */
  readonly onEdit?: () => void;

  /**
   * The callback to call when the user want to delete this game.
   */
  readonly onDelete?: () => void;

  /**
   * The callback to call when the user wants to start voting.
   */
  readonly onStartVoting?: () => void;
}

export const GameDetail = function GameDetail({ name, points, onEdit, onDelete, onStartVoting }: Props): JSX.Element {
  if (!name || !points) {
    return (
      <div className={styles.root}>
        <div className={styles.empty}>Select game from list</div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <button className={styles.editButton} onClick={onEdit} aria-label="Edit">
        <Icon.Pencil variant={Variant.emerald} />
      </button>
      <div className={styles.defList}>
        <span className={styles.defListLabel}>Name</span>
        <span className={styles.defListContent}>{name}</span>
      </div>
      <div className={styles.defList}>
        <span className={styles.defListLabel}>Points</span>
        <span className={styles.defListContent}>{points}</span>
      </div>
      <div className={styles.footer}>
        <button className={styles.deleteButton} onClick={onDelete}>
          <Icon.Trash variant={Variant.cerise} />
          Delete
        </button>
        <button className={styles.startVotingButton} onClick={onStartVoting}>
          <Icon.Check variant={Variant.emerald} />
          Start Voting
        </button>
      </div>
    </div>
  );
};
