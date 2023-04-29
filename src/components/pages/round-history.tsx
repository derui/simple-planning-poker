import classNames from "classnames";
import { generatePath, useNavigate, useParams } from "react-router";
import { useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { AveragePointShowcase } from "../presentations/average-point-showcase";
import { GameResultAreaContainer } from "../containers/game-result-area-container";
import { FinishedRoundSidebarContainer } from "../containers/finished-round-sidebar-container";
import { RoundHistoryHeaderContainer } from "../containers/round-history-header-container";
import { isFinished } from "@/utils/loadable";
import { selectOpenedRoundHistory } from "@/status/selectors/finished-rounds";

const styles = {
  root: classNames("flex", "flex-col", "h-full", "overflow-hidden"),
  main: classNames("flex", "flex-auto", "p-2", "z-20"),
  showcase: classNames("flex", "flex-auto", "p-2", "z-20"),
};

// eslint-disable-next-line func-style
export function RoundHistoryPage() {
  const params = useParams<{ gameId: string; roundId: string }>();
  const averageResult = useAppSelector(selectOpenedRoundHistory(params.roundId!));
  const navigate = useNavigate();

  let showcase = (
    <div className={styles.showcase}>
      <Skeleton />
    </div>
  );

  if (isFinished(averageResult)) {
    showcase = (
      <AveragePointShowcase averagePoint={`${averageResult[0].averagePoint}`} cardCounts={averageResult[0].length} />
    );
  }

  const handleBack = () => {
    navigate(generatePath("/game/:gameId", { gameId: params.gameId! }));
  };

  return (
    <div className={styles.root}>
      <RoundHistoryHeaderContainer onBack={handleBack} />
      <main className={styles.main}>
        <GameResultAreaContainer readonly={true} />
      </main>
      {showcase}
      <FinishedRoundSidebarContainer testid="sidebar" />
    </div>
  );
}

export default RoundHistoryPage;
