import { useMemo } from "react";
import { usePollingPlace } from "../../atoms/use-polling-place.js";
import { useVoter } from "../../atoms/use-voter.js";
import { useVoting } from "../../atoms/use-voting.js";
import { VotingAreaLayout } from "./voting-area.layout.js";

/**
 * VotingArea container
 */
export const VotingArea = function VotingArea(): JSX.Element {
  const place = usePollingPlace();
  const voting = useVoting();
  const voter = useVoter();

  const theme = useMemo(() => {
    return place.pollingPlace?.theme;
  }, [place.pollingPlace]);

  const userRole = useMemo(() => {
    return voter.role;
  }, [voter.role]);

  return (
    <VotingAreaLayout
      loading={voting.loading}
      theme={theme}
      userRole={userRole}
      onSelect={(v) => voting.estimate(Number(v))}
      selected={voting.estimated ? String(voting.estimated) : undefined}
      voters={place.estimations}
      inspectors={place.inspectors}
      points={place.points}
      onReveal={voting.reveal}
    />
  );
};
