import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";

type Props = BaseProps;

const styles = {
  root: classNames("flex", "flex-auto", "w-full", "h-full", "animate-pulse", "bg-lightgray"),
};

// eslint-disable-next-line func-style
export function Skeleton(props: Props) {
  const gen = generateTestId(props.testid);

  return <div className={styles.root} data-testid={gen("root")}></div>;
}
