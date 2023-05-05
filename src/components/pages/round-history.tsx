import classNames from "classnames";
import { generatePath, useNavigate, useParams } from "react-router";
import { RoundHistoriesSidebarContainer } from "../containers/round-histories-sidebar-container";
import { RoundHistoryHeaderContainer } from "../containers/round-history-header-container";
import { RoundHistoryAverageShowcase } from "../containers/round-history-average-showcase";
import { RoundHistoryResultAreaContainer } from "../containers/round-history-result-area-container";

const styles = {
  root: classNames("flex", "flex-col", "h-full", "overflow-hidden"),
  main: classNames("flex", "flex-auto", "p-2", "z-20"),
  showcase: classNames("flex", "flex-auto", "p-2", "z-20"),
};

// eslint-disable-next-line func-style
export function RoundHistoryPage() {
  const params = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(generatePath("/game/:gameId", { gameId: params.gameId! }));
  };

  const handleRoundSelect = (id: string) => {
    navigate(generatePath("/game/:gameId/round/:roundId/history", { gameId: params.gameId!, roundId: id }));
  };

  return (
    <div className={styles.root}>
      <RoundHistoryHeaderContainer onBack={handleBack} />
      <main className={styles.main}>
        <RoundHistoryResultAreaContainer />
      </main>
      <RoundHistoryAverageShowcase testid="showcase" />
      <RoundHistoriesSidebarContainer testid="sidebar" onRoundSelect={handleRoundSelect} />
    </div>
  );
}

export default RoundHistoryPage;
