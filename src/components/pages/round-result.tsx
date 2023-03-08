import * as React from "react";
import classNames from "classnames";
import { GameAreaContainer } from "../containers/game-area-container";
import { GameHeaderContainer } from "../containers/game-header-container";
import { useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { AveragePointShowcase } from "../presentations/average-point-showcase";
import { isFinished } from "@/utils/loadable";
import { selectRoundResult } from "@/status/selectors/game";

const styles = {
  root: classNames("flex", "flex-col", "h-full"),
  main: classNames("flex", "flex-auto", "p-2", "z-20"),
  showcase: classNames("flex", "flex-auto", "p-2", "z-20"),
};

// eslint-disable-next-line func-style
export function RoundResult() {
  const averageResult = useAppSelector(selectRoundResult());

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

  return (
    <div className={styles.root}>
      <GameHeaderContainer />
      <main className={styles.main}>
        <GameAreaContainer />
      </main>
      {showcase}
    </div>
  );
}
