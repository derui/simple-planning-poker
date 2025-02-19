import { useCallback, useMemo } from "react";
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

  const pollingPlace = useMemo(() => {
    return place.pollingPlace;
  }, [place.pollingPlace]);

  const theme = useMemo(() => {
    return place.pollingPlace?.theme;
  }, [place.pollingPlace]);

  const userRole = useMemo(() => {
    return voter.role;
  }, [voter.role]);

  const onSelect = useCallback(
    (v: string) => {
      voting.estimate(Number(v));
    },
    [voting.estimate]
  );

  const onToggleRole = useCallback(() => {
    voter.toggleRole();
  }, [voter.toggleRole]);

  const onChangeTheme = useCallback(
    (newTheme: string) => {
      voting.changeTheme(newTheme);
    },
    [voting.changeTheme]
  );

  return (
    <VotingAreaLayout
      theme={theme}
      userRole={userRole}
      onSelect={onSelect}
      selected={voting.estimated ? String(voting.estimated) : undefined}
      voters={pollingPlace?.estimations}
      inspectors={pollingPlace?.inspectors}
      points={pollingPlace?.points}
      onReveal={voting.reveal}
      onToggleRole={onToggleRole}
      onChangeTheme={onChangeTheme}
    />
  );
};
