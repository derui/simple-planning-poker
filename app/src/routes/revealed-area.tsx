import { hooks, RevealedArea } from "@spp/feature-voting";
import { Voting } from "@spp/shared-domain";
import { useEffect } from "react";
import { useParams } from "react-router";

/**
 * Route for voting area
 */
export const RevealedAreaRoute = function RevealedAreaRoute(): JSX.Element {
  const param = useParams<{ votingId: string }>();
  const join = hooks.useJoin();

  useEffect(() => {
    if (param.votingId) {
      join.join(Voting.createId(param.votingId));
    }
  }, [param.votingId]);

  return <RevealedArea />;
};
