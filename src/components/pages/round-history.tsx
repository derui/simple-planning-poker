import classNames from "classnames";
import { generatePath, useNavigate, useParams } from "react-router";
import { GameResultAreaContainer } from "../containers/game-result-area-container";
import { FinishedRoundSidebarContainer } from "../containers/finished-round-sidebar-container";
import { RoundHistoryHeaderContainer } from "../containers/round-history-header-container";
import { RoundHistoryAverageShowcase } from "../containers/round-history-average-showcase";

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

  return (
    <div className={styles.root}>
      <RoundHistoryHeaderContainer onBack={handleBack} />
      <main className={styles.main}>
        <GameResultAreaContainer readonly={true} />
      </main>
      <RoundHistoryAverageShowcase testid="showcase" />
      <FinishedRoundSidebarContainer testid="sidebar" />
    </div>
  );
}

export default RoundHistoryPage;
