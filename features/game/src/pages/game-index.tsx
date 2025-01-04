import { useCallback } from "react";
import { Route, Switch, useLocation } from "wouter";
import { GameCreator } from "../components/containers/game-creator.js";
import { GameDetail } from "../components/containers/game-detail.js";
import { GameList } from "../components/containers/game-list.js";
import { UserHeader } from "../components/containers/user-header.js";
import * as styles from "./game-index.css.js";

interface Props {
  /**
   * Handler to notify start voting to page.
   */
  onStartVoting: (gameId: string) => void;
}

// eslint-disable-next-line func-style
export function GameIndex({ onStartVoting }: Props): JSX.Element {
  const [loc, navigate] = useLocation();
  console.log(loc);

  const onCreated = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const onCancelCreate = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const handleCreate = useCallback(() => {
    navigate("/create");
  }, [navigate]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <UserHeader />
      </div>
      <div className={styles.list}>
        <GameList onCreate={handleCreate} />
      </div>
      <div className={styles.detail}>
        <Switch>
          <Route path="/create">
            <GameCreator onCreated={onCreated} onCancel={onCancelCreate} />
          </Route>
          <Route path="/">
            <GameDetail onStartVoting={onStartVoting} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
