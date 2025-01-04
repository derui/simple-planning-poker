import { GameCreator } from "../components/containers/game-creator.js";
import { GameDetail } from "../components/containers/game-detail.js";
import { GameList } from "../components/containers/game-list.js";
import { UserHeader } from "../components/containers/user-header.js";
import * as styles from "./game-index.css.js";

interface Props {
  /**
   * The mode of the game index page.
   */
  mode: "list" | "create";

  onStartVoting: (gameId: string) => void;

  /**
   * The callback function to be called when a game is created.
   */
  onCreated: () => void;

  /**
   * The callback function to be called when a creating game is cancelled.
   */
  onCancelCreate: () => void;
}

// eslint-disable-next-line func-style
export function GameIndexLayout({ mode, onStartVoting, onCreated, onCancelCreate }: Props): JSX.Element {
  let component: JSX.Element;
  if (mode == "create") {
    component = <GameCreator onCreated={onCreated} onCancel={onCancelCreate} />;
  } else {
    component = <GameDetail onStartVoting={onStartVoting} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <UserHeader />
      </div>
      <div className={styles.list}>
        <GameList />
      </div>
      <div className={styles.detail}>{component}</div>
    </div>
  );
}
