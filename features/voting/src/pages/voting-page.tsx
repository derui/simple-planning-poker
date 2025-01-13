import { useLoginUser } from "@spp/feature-login";
import { Voting } from "@spp/shared-domain";
import { useEffect } from "react";
import { Route, Switch, useLocation, useParams } from "wouter";
import { JoinedVotingStatus } from "../atoms/type.js";
import { useJoin } from "../atoms/use-join.js";
import { RevealedArea } from "../components/containers/revealed-area.js";
import { VotingArea } from "../components/containers/voting-area.js";
import * as styles from "./voting-page.css.js";

// eslint-disable-next-line func-style
export function VotingPage(): JSX.Element {
  const param = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const join = useJoin();
  const { userId } = useLoginUser();

  useEffect(() => {
    if (userId && param.id && join.status == JoinedVotingStatus.NotJoined) {
      join.join(userId, Voting.createId(param.id));
    }
  }, [userId, param.id, join.join]);

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
