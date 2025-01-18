import React, { useEffect } from "react";
import lazyImport from "../utils/lazy-import.js";

import { usePullVoitngUpdate } from "@spp/feature-voting";
import { VotingObserverImpl } from "@spp/infra-domain";
import { Voting } from "@spp/shared-domain";
import { JSX } from "react/jsx-runtime";
import { useParams } from "wouter";

interface Props {
  userId: string;
}

const LaziedVotingPage = React.lazy(() =>
  lazyImport(import("@spp/feature-voting")).then((v) => ({ default: v.VotingPage }))
);

const observer = new VotingObserverImpl();

export const VotingPage = function VotingPage({ userId }: Props): JSX.Element {
  const params = useParams<{ votingId: string }>();
  const { pullUpdate } = usePullVoitngUpdate();

  useEffect(() => {
    observer.subscribe(Voting.createId(params.votingId), () => {
      pullUpdate();
    });
  }, [params.votingId]);

  return <LaziedVotingPage currentUserId={userId} votingId={params.votingId} />;
};
