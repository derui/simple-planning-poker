import * as AppUrl from "@spp/shared-app-url";
import { Voting } from "@spp/shared-domain";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VotingStatus } from "../../atoms/voting.js";
import { hooks } from "../../hooks/facade.js";
import { VotingAreaLayout } from "./voting-area.layout.js";

/**
 * VotingArea container
 */
export const VotingArea = function VotingArea(): JSX.Element {
  const place = hooks.usePollingPlace();
  const voting = hooks.useVoting();
  const { status } = hooks.useVotingStatus();
  const navigate = useNavigate();

  useEffect(() => {
    const votingId = place.id;
    if (status == VotingStatus.Revealed && votingId) {
      navigate(AppUrl.revealedPage(Voting.createId(votingId)));
    }
  }, [status, place.id]);

  return (
    <VotingAreaLayout
      loading={status != VotingStatus.Voting}
      theme={place.theme}
      userRole={place.userRole}
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
