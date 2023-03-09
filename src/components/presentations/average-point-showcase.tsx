import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  cardCounts: [number, number][];
  averagePoint: string;
}

const styles = {
  root: classNames("flex", "justify-center", "px-3", "py-2", "relative", "h-32", "items-center"),
  results: classNames("flex", "flex-none"),
  average: classNames("flex", "flex-col", "justify-center", "items-center", "bg-primary-400", "rounded", "p-3"),
  equal: classNames(
    "flex-none",
    "inline-block",
    "w-6",
    "h-6",
    "bg-primary-400",
    "mr-4",
    "[mask-size:cover]",
    "[mask-repeat:no-repeat]",
    "[mask-position:center]",
    '[mask-image:url("/static/svg/tabler-icons/equal.svg")]'
  ),
  averageLabel: classNames("flex-none", "text-secondary2-200"),
  averageValue: classNames("flex-none", "items-center", "text-xl", "text-secondary2-200"),

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
    count: classNames("text-black", "align-center", "absolute", "bottom-0"),
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
        {props.cardCounts.map(([storyPoint, count], index) =>
          createResultDisplay(index, storyPoint, count, gen("resultCard"))
        )}
      </div>

      <div className={styles.equal}> </div>
      <div className={styles.average} data-testid={gen("average")}>
        <span className={styles.averageLabel}>Score</span>
        <span className={styles.averageValue}>{props.averagePoint}</span>
      </div>
    </div>
  );
}
