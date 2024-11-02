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
