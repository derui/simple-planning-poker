import { User, Voting } from "@spp/shared-domain";
import { useEffect } from "react";
import { Route, useLocation } from "wouter";
import { JoinedVotingStatus } from "../atoms/type.js";
import { useJoin } from "../atoms/use-join.js";
import { RevealedArea } from "../components/containers/revealed-area.js";
import { VotingArea } from "../components/containers/voting-area.js";
import * as styles from "./voting-page.css.js";

interface Props {
  /**
   * The voting id
   */
  votingId: string;

  /**
   * The current user's ID
   */
  currentUserId: string;
}

// eslint-disable-next-line func-style
export function VotingPage({ currentUserId, votingId }: Props): JSX.Element {
  const [, navigate] = useLocation();
  const join = useJoin();

  useEffect(() => {
    join.join(User.createId(currentUserId), Voting.createId(votingId));
  }, [currentUserId, votingId]);

  useEffect(() => {
    if (join.status === JoinedVotingStatus.Revealed) {
      navigate(`/revealed/`, { replace: true });
    }
  }, [join.status]);

  return (
    <div className={styles.root}>
      <Route path="/revealed">
        <RevealedArea />
      </Route>
      <Route>
        <VotingArea />
      </Route>
    </div>
  );
}
