import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { Skeleton } from "../presentations/skeleton";
import { AveragePointShowcase } from "../presentations/average-point-showcase";
import { useAppSelector } from "../hooks";
import { isFinished } from "@/utils/loadable";
import { selectOpenedRoundHistory } from "@/status/selectors/round-history";

type Props = BaseProps;

const styles = {
  showcase: classNames("flex", "flex-auto", "p-2", "z-20"),
} as const;

// eslint-disable-next-line func-style
export function RoundHistoryAverageShowcase(props: Props) {
  const gen = generateTestId(props.testid);
  const averageResult = useAppSelector(selectOpenedRoundHistory);

  if (!isFinished(averageResult)) {
    return (
      <div className={styles.showcase}>
        <Skeleton testid={gen("skeleton")} />
      </div>
    );
  }

  return (
    <AveragePointShowcase
      testid={gen("average-point")}
      averagePoint={`${averageResult[0].results.averagePoint}`}
      cardCounts={averageResult[0].results.cardCounts}
    />
  );
}
