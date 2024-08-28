import { clsx } from "clsx";

const styles = {
  root: clsx("flex", "flex-none", "w-full", "h-10", "animate-pulse", "bg-lightgray"),
};

// eslint-disable-next-line func-style
export function Skeleton() {
  return <div className={styles.root} aria-busy="true"></div>;
}
