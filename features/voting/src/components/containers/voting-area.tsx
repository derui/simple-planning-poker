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
    />
  );
};
