import * as AppUrl from "@spp/shared-app-url";
import { Voting } from "@spp/shared-domain";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VotingStatus } from "../../atoms/voting.js";
import { hooks } from "../../hooks/facade.js";
import { RevealedAreaLayout } from "./revealed-area.layout.js";

/**
 * RevealedArea container
 */
export const RevealedArea = function RevealedArea(): JSX.Element {
  const place = hooks.usePollingPlace();
  const revealed = hooks.useRevealed();
  const { status } = hooks.useVotingStatus();
  const navigate = useNavigate();

  useEffect(() => {
    const votingId = place.id;
    if (status == VotingStatus.Voting && votingId) {
      navigate(AppUrl.votingPage(Voting.createId(votingId)));
    }
  }, [status, place.id]);

  return (
    <RevealedAreaLayout
      loading={status != VotingStatus.Voting}
      theme={place.theme}
      userRole={place.userRole}
      voters={place.estimations}
      inspectors={place.inspectors}
      onChangeTheme={revealed.changeTheme}
      onReset={revealed.reset}
    />
  );
};
