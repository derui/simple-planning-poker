import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import * as styles from "./game-detail.css.js";

export interface Props {
  readonly name: string;

  readonly points: string;

  /**
   * The callback to call when the user clicks on the edit button.
   */
  readonly onEdit?: () => void;

  /**
   * The callback to call when the user want to delete this game.
   */
  readonly onDelete?: () => void;
}

export const GameDetail = function GameDetail({ name, points, onEdit, onDelete }: Props): JSX.Element {
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
      </div>
    </div>
  );
};
