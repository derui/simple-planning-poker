import classNames from "classnames";
import { useParams } from "react-router";
import { useEffect } from "react";
import { CardHolder } from "../presentations/card-holder";
import { GameHeaderContainer } from "../containers/game-header-container";
import { GameAreaContainer } from "../containers/game-area-container";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { selectCards, selectPlayerHandedCard } from "@/status/selectors/game";
import { isFinished } from "@/utils/loadable";
import { handCard } from "@/status/actions/round";
import { openGame } from "@/status/actions/game";
import * as Game from "@/domains/game";

const styles = {
  root: classNames("flex", "flex-col", "h-full"),
  main: classNames("flex", "flex-auto", "p-2", "z-20", "h-full"),
  cardHolder: classNames("flex", "flex-auto", "p-2", "z-20"),
};

// eslint-disable-next-line func-style
function CardHolderContainer() {
  const cards = useAppSelector(selectCards());
  const playerHand = useAppSelector(selectPlayerHandedCard());
  const dispatch = useAppDispatch();

  if (!isFinished(cards)) {
    return (
      <div className={styles.cardHolder}>
        <Skeleton />
      </div>
    );
  }

  const handleSelectCard = (index: number) => dispatch(handCard({ cardIndex: index }));

  return (
    <CardHolder
      displays={cards[0].map((v) => v.display)}
      selectedIndex={playerHand.cardIndex}
      onSelect={handleSelectCard}
    />
  );
}

// eslint-disable-next-line func-style
export function RoundPage() {
  const param = useParams<{ gameId: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (param.gameId) {
      dispatch(openGame(param.gameId as Game.Id));
    }
  }, [param.gameId]);

  return (
    <div className={styles.root}>
      <GameHeaderContainer />
      <main className={styles.main}>
        <GameAreaContainer />
      </main>
      <CardHolderContainer />
    </div>
  );
}

export default RoundPage;
