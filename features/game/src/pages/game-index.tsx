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
      <Switch>
        <Route path="/create">
          <GameCreator onCreated={onCreated} onCancel={onCancelCreate} />
        </Route>
        <Route path="/">
          <div className={styles.listRoot}>
            <div className={styles.header}>
              <UserHeader />
            </div>
            <div className={styles.list}>
              <GameList onCreate={handleCreate} />
            </div>
            <div className={styles.detail}>
              <GameDetail onStartVoting={onStartVoting} />
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
