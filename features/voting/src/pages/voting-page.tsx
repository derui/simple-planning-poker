import { useEffect } from "react";
import { Route, Switch, useLocation, useParams } from "wouter";
import { JoinedVotingStatus } from "../atoms/type.js";
import { useJoin } from "../atoms/use-join.js";
import { RevealedArea } from "../components/containers/revealed-area.js";
import { VotingArea } from "../components/containers/voting-area.js";
import * as styles from "./voting-page.css.js";

interface Props {
  currentUserId: string;
}

// eslint-disable-next-line func-style
export function VotingPage({ currentUserId }: Props): JSX.Element {
  const param = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const join = useJoin();

  useEffect(() => {
    if (currentUserId && param.id && join.status == JoinedVotingStatus.NotJoined) {
      join.join(currentUserId, Voting.createId(param.id));
    }
  }, [currentUserId, param.id, join.join]);

  useEffect(() => {
    if (join.status === JoinedVotingStatus.Revealed) {
      navigate(`/revealed/:id`, { replace: true });
    }
  }, []);

  return (
    <div className={styles.root}>
      <Switch>
        <Route path="/:id">
          <VotingArea />
        </Route>
        <Route path="/revealed/:id">
          <RevealedArea />
        </Route>
      </Switch>
    </div>
  );
}
