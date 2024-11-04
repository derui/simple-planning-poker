import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import * as styles from "./game-list-item.css.js";

export interface Props {
  gameId: string;
  name: string;
  selected?: boolean;
  onClick?: () => void;
}

export const GameListItem = function GameListItem({ gameId, selected = false, name, onClick }: Props): JSX.Element {
  return (
    <li key={gameId} className={styles.main} onClick={onClick} aria-selected={selected}>
      <div className={styles.link}>
        <span className={styles.linkName}>{name}</span>
        <span className={styles.selectMarkContainer}>
          <span className={styles.selectMark} aria-label="mark" aria-selected={selected}>
            <Icon.Check variant={Variant.indigo} />
          </span>
        </span>
      </div>
    </li>
  );
};
