import classNames from "classnames";
import { useEffect } from "react";
import { generatePath, useNavigate, useParams } from "react-router";
import { GameHeaderContainer } from "../containers/game-header-container";
import { useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { AveragePointShowcase } from "../presentations/average-point-showcase";
import { GameResultAreaContainer } from "../containers/game-result-area-container";
import { isFinished } from "@/utils/loadable";
import { selectRoundResult, selectRoundStatus } from "@/status/selectors/game";

const styles = {
  root: classNames("flex", "flex-col", "h-full"),
  main: classNames("flex", "flex-auto", "p-2", "z-20"),
  showcase: classNames("flex", "flex-auto", "p-2", "z-20"),
};

// eslint-disable-next-line func-style
export function RoundResultPage() {
  const params = useParams<{ gameId: string }>();
  const averageResult = useAppSelector(selectRoundResult());
  const navigate = useNavigate();
  const roundStatus = useAppSelector(selectRoundStatus());

  let showcase = (
    <div className={styles.showcase}>
      <Skeleton />
    </div>
  );
  if (isFinished(averageResult)) {
    showcase = (
      <AveragePointShowcase averagePoint={`${averageResult[0].average}`} cardCounts={averageResult[0].cardAndCounts} />
    );
  }

  useEffect(() => {
    if (isFinished(roundStatus) && roundStatus[0].state !== "Finished") {
      navigate(generatePath("/game/:gameId/round/:roundId", { gameId: params.gameId!, roundId: roundStatus[0].id }));
    }
  }, [roundStatus]);

  return (
    <div className={styles.root}>
      <GameHeaderContainer />
      <main className={styles.main}>
        <GameResultAreaContainer />
      </main>
      {showcase}
    </div>
  );
}

export default RoundResultPage;
