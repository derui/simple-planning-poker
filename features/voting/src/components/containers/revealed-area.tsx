import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RevealedAreaLayout } from "./revealed-area.layout.js";
import { usePollingPlace } from "../../atoms/use-polling-place.js";
import { useRevealed } from "../../atoms/use-revealed.js";

/**
 * RevealedArea container
 */
export const RevealedArea = function RevealedArea(): JSX.Element {
  const place = usePollingPlace();
  const revealed = useRevealed();
  const navigate = useNavigate();

  const pollingPlace = useMemo(() => {
    return place.pollingPlace;
  }, [place.pollingPlace]);

  const theme = useMemo(() => {
    return pollingPlace?.theme;
  }, [pollingPlace]);

  const userRole = useMemo(() => {
    return place.userRole;
  }, [place.userRole]);

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
      loading={revealed.loading}
      theme={theme}
      userRole={userRole}
      voters={pollingPlace?.estimations}
      inspectors={pollingPlace?.inspectors}
      onChangeTheme={onChangeTheme}
      onReset={onReset}
    />
  );
};
