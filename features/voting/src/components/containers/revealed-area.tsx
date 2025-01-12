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

    return (
    <RevealedAreaLayout
      loading={revealed.loading}
      theme={place.theme}
      userRole={place.userRole}
      voters={place.estimations}
      inspectors={place.inspectors}
      onChangeTheme={revealed.changeTheme}
      onReset={revealed.reset}
    />
  );
};
