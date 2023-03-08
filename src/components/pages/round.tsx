import * as React from "react";
import classNames from "classnames";
import { CardHolder } from "../presentations/card-holder";
import { GameHeaderContainer } from "../containers/game-header-container";
import { GameAreaContainer } from "../containers/game-area-container";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { selectCards, selectPlayerHandedCard } from "@/status/selectors/game";
import { isFinished } from "@/utils/loadable";
import { handCard } from "@/status/actions/game";

const styles = {
  root: classNames("flex", "flex-col", "h-full"),
  main: classNames("flex", "flex-auto", "p-2", "z-20"),
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
export function Round() {
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
