import { useCallback, useMemo } from "react";
import { usePollingPlace } from "../../atoms/use-polling-place.js";
import { useRevealed } from "../../atoms/use-revealed.js";
import { useVoter } from "../../atoms/use-voter.js";
import { RevealedAreaLayout } from "./revealed-area.layout.js";

/**
 * RevealedArea container
 */
export const RevealedArea = function RevealedArea(): JSX.Element {
  const place = usePollingPlace();
  const revealed = useRevealed();
  const voter = useVoter();

  const pollingPlace = useMemo(() => {
    return place.pollingPlace;
  }, [place.pollingPlace]);

  const theme = useMemo(() => {
    return pollingPlace?.theme;
  }, [pollingPlace]);

  const userRole = useMemo(() => {
    return voter.role;
  }, [voter.role]);

  const onChangeTheme = useCallback(
    (newTheme: string) => {
      revealed.changeTheme(newTheme);
    },
    [revealed.changeTheme]
  );

  const onReset = useCallback(() => {
    revealed.reset();
  }, [revealed.reset]);

  return (
    <RevealedAreaLayout
      theme={theme}
      userRole={userRole}
      voters={pollingPlace?.estimations}
      inspectors={pollingPlace?.inspectors}
      onChangeTheme={onChangeTheme}
      onReset={onReset}
      average={revealed.averageEstimation}
    />
  );
};
