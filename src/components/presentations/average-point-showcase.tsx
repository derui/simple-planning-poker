import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";

interface Props extends BaseProps {
  cardCounts: { point: number; count: number }[];
  averagePoint: string;
}

const styles = {
  root: classNames("flex", "justify-center", "px-3", "py-2", "relative", "h-32", "items-center"),
  results: classNames("flex", "flex-none"),
  average: classNames(
    "flex",
    "flex-col",
    "justify-center",
    "items-center",
    "bg-white",
    "border",
    "border-secondary2-500",
    "rounded",
    "p-3"
  ),
  equal: classNames("flex-none", "inline-block", "w-6", "h-6", "before:bg-primary-400", "mr-4", iconize("equal")),
  averageLabel: classNames("flex-none", "text-secondary2-500"),
  averageValue: classNames("flex-none", "items-center", "text-xl", "text-secondary2-500"),

  resultDisplay: {
    root: classNames("flex", "flex-col", "items-center", "mr-3", "last-of-type:mr-6"),
    card: classNames(
      "flex",
      "flex-col",
      "h-16",
      "w-12",
      "rounded",
      "border",
      "border-primary-400",
      "text-center",
      "justify-center",
      "m-3",
      "relative"
    ),
    count: classNames("text-gray", "align-center", "absolute", "bottom-0"),
  },
};

const createResultDisplay = (index: number, storyPoint: number, count: number, testid: string) => {
  return (
    <div className={styles.resultDisplay.root} key={index} data-testid={testid}>
      <span className={styles.resultDisplay.card}>{storyPoint}</span>
      <span className={styles.resultDisplay.count}>{count} votes</span>
    </div>
  );
};

// eslint-disable-next-line func-style
export function AveragePointShowcase(props: Props) {
  const gen = generateTestId(props.testid);

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <div className={styles.results}>
        {props.cardCounts.map(({ point, count }, index) => createResultDisplay(index, point, count, gen("resultCard")))}
      </div>

      <div className={styles.equal}> </div>
      <div className={styles.average} data-testid={gen("average")}>
        <span className={styles.averageLabel}>Score</span>
        <span className={styles.averageValue}>{props.averagePoint}</span>
      </div>
    </div>
  );
}
