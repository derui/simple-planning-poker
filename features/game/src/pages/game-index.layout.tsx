import { GameStatus } from "../atoms/game-atom.js";
import { GameDetail } from "../components/containers/game-detail.js";
import { GameList } from "../components/containers/game-list.js";
import { UserHeader } from "../components/containers/user-header.js";
import { hooks } from "../hooks/facade.js";
import * as styles from "./game-index.css.js";

interface Props {
  onStartVoting?: (gameId: string) => void;
}

// eslint-disable-next-line func-style
export function GameIndexLayout({ onStartVoting }: Props): JSX.Element {
  const { status } = hooks.useGameIndex();

  let component: JSX.Element;
  if (status == GameStatus.Create || status == GameStatus.Creating) {
    component = <div></div>;
  } else if (status == GameStatus.Edit || status == GameStatus.Editing) {
    component = <div></div>;
  } else {
    component = <GameDetail onStartVoting={onStartVoting} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <UserHeader />
      </div>
      <div className={styles.list.container}>
        <GameList />
      </div>
      <div className={styles.detailContainer}>{component}</div>
    </div>
  );
}
