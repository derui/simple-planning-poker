import classNames from "classnames";

const styles = {
  root: classNames("flex", "flex-none", "w-full", "h-10", "animate-pulse", "bg-lightgray"),
};

// eslint-disable-next-line func-style
export function Skeleton() {
  return <div className={styles.root} aria-busy="true"></div>;
}
