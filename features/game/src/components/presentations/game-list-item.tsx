import * as styles from "./game-list-item.css.js";

export interface Props {
  gameId: string;
  name: string;
  owned?: boolean;
  onClick?: () => void;
}

export const GameListItem = function GameListItem({ gameId, owned, name, onClick }: Props): JSX.Element {
  return (
    <li key={gameId} className={styles.main} onClick={onClick}>
      <div className={styles.link}>
        <span className={styles.linkName}>{name}</span>
        <span className={styles.ownerMarkContainer}>
          <span className={owned ? styles.ownerMark : styles.ownerMarkInvisible}>Owner</span>
        </span>
      </div>
    </li>
  );
};
