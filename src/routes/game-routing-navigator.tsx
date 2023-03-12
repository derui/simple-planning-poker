import { useEffect } from "react";
import { generatePath, useNavigate } from "react-router";
import { useAppSelector } from "@/components/hooks";
import { selectCurrentGameId, selectCurrentRoundId, selectRoundResult } from "@/status/selectors/game";
import { isFinished } from "@/utils/loadable";

// eslint-disable-next-line func-style
export function GameRoutingNavigator() {
  const gameId = useAppSelector(selectCurrentGameId());
  const roundId = useAppSelector(selectCurrentRoundId());
  const roundResult = useAppSelector(selectRoundResult());
  const navigate = useNavigate();

  // navigate result after show down. navigate new round if
  useEffect(() => {
    if (gameId && roundId) {
      if (isFinished(roundResult)) {
        navigate(generatePath("/game/:gameId/round/:roundId/result", { gameId, roundId }));
      }
    }
  }, [gameId, roundId, roundResult]);

  return null;
}
