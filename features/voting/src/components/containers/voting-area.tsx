import * as AppUrl from "@spp/shared-app-url";
import { Voting } from "@spp/shared-domain";
import { VotingAreaLayout } from "./voting-area.layout.js";
import { usePollingPlace } from "../../atoms/use-polling-place.js";
import { useVoting } from "../../atoms/use-voting.js";
import { useMemo } from "react";

/**
 * VotingArea container
 */
export const VotingArea = function VotingArea(): JSX.Element {
  const place = usePollingPlace();
  const voting = useVoting();

  const theme = useMemo(() => {
    return place.pollingPlace?.theme
  }, [place.pollingPlace])

  const userRole = useMemo(() => {
    
  }, [voting.])

  return (
    <VotingAreaLayout
      loading={voting.loading}
      theme={theme}
      userRole={place.pollingPlace}
      onSelect={(v) => voting.estimate(Number(v))}
      selected={voting.estimated ? String(voting.estimated) : undefined}
      voters={place.estimations}
      inspectors={place.inspectors}
      onChangeTheme={voting.changeTheme}
      onChangeRole={voting.changeVoterRole}
      points={place.points}
      onReveal={voting.reveal}
    />
  );
};
