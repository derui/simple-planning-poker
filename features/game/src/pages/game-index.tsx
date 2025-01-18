import { useCallback, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useUserInfo } from "../atoms/use-user-info.js";
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

  /**
   * The user id
   */
  userId: string;
}

// eslint-disable-next-line func-style
export function GameIndex({ onStartVoting, userId }: Props): JSX.Element {
  const [loc, navigate] = useLocation();
  const { loadUser } = useUserInfo();

  const onCreated = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const onCancelCreate = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const handleCreate = useCallback(() => {
    navigate("/create");
  }, [navigate]);

  useEffect(() => {
    loadUser(userId);
  }, [userId]);

  return (
    <div className={styles.root}>
      <Switch>
        <Route path="/create">
          <GameCreator onCreated={onCreated} onCancel={onCancelCreate} />
        </Route>
        <Route>
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
