import * as AppUrl from "@spp/shared-app-url";
import { Game } from "@spp/shared-domain";
import { Link } from "react-router-dom";
import * as styles from "./game-list-item.css.js";

export interface Props {
  gameId: string;
  name: string;
  owned?: boolean;
}

export const GameListItem = function GameListItem({ gameId, owned, name }: Props): JSX.Element {
  return (
    <li key={gameId} className={styles.main}>
      <Link className={styles.link} to={AppUrl.votingPage(Game.createId(gameId))}>
        <span className={styles.linkName}>{name}</span>
        <span className={styles.ownerMarkContainer}>
          <span className={owned ? styles.ownerMark : styles.ownerMarkInvisible}>Owner</span>
        </span>
      </Link>
    </li>
  );
};
