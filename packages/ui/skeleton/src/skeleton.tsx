import { clsx } from "clsx";

const styles = {
  root: clsx("grid", "w-full", "h-full", "animate-pulse", "bg-gray-200"),
};

// eslint-disable-next-line func-style
export function Skeleton() {
  return <div className={styles.root} aria-busy="true"></div>;
}
