import classNames from "classnames";
import { generatePath, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { CardHolder } from "../presentations/card-holder";
import { GameHeaderContainer } from "../containers/game-header-container";
import { GameAreaContainer } from "../containers/game-area-container";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { InspectorHolder } from "../presentations/inspector-holder";
import { RoundHistoriesSidebarContainer } from "../containers/round-histories-sidebar-container";
import { selectCards, selectPlayerEstimatedCards, selectRoundStatus } from "@/status/selectors/game";
import { isFinished } from "@/utils/loadable";
import { estimate } from "@/status/actions/round";
import { openGame } from "@/status/actions/game";
import * as Game from "@/domains/game";
import { selectUserInfo } from "@/status/selectors/user";
import { UserMode } from "@/domains/game-player";

const styles = {
  root: classNames("flex", "flex-col", "h-full"),
  main: classNames("flex", "flex-auto", "p-2", "z-20", "h-full"),
  cardHolder: classNames("flex", "flex-auto", "p-2", "z-20"),
};

// eslint-disable-next-line func-style
function CardHolderContainer() {
  const params = useParams<{ gameId: string }>();
  const cards = useAppSelector(selectCards);
  const roundStatus = useAppSelector(selectRoundStatus);
  const playerEstimation = useAppSelector(selectPlayerEstimatedCards);
  const userMode = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isFinished(roundStatus) && roundStatus[0].state === "Finished") {
      navigate(
        generatePath("/game/:gameId/round/:roundId/result", { gameId: params.gameId!, roundId: roundStatus[0].id })
      );
    }
  }, [roundStatus]);

  if (!isFinished(cards) || !isFinished(roundStatus) || !isFinished(userMode)) {
    return (
      <div className={styles.cardHolder}>
        <Skeleton />
      </div>
    );
  }

  if (userMode[0].userMode === UserMode.inspector) {
    return <InspectorHolder />;
  }

  const handleSelectCard = (index: number) => dispatch(estimate({ cardIndex: index }));

  return (
    <CardHolder
      displays={cards[0].map((v) => v.display)}
      selectedIndex={playerEstimation.cardIndex}
      onSelect={handleSelectCard}
    />
  );
}

// eslint-disable-next-line func-style
export function RoundPage() {
  const param = useParams<{ gameId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (param.gameId) {
      dispatch(openGame(param.gameId as Game.Id));
    }
  }, [param.gameId]);

  const handleRoundSelect = (id: string) => {
    navigate(generatePath("/game/:gameId/round/:roundId/history", { gameId: param.gameId!, roundId: id }));
  };

  return (
    <div className={styles.root}>
      <GameHeaderContainer />
      <main className={styles.main}>
        <GameAreaContainer />
      </main>
      <CardHolderContainer />
      <RoundHistoriesSidebarContainer testid="sidebar" onRoundSelect={handleRoundSelect} />
    </div>
  );
}

export default RoundPage;
