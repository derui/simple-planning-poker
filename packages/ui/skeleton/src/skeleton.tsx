import { clsx } from "clsx";

const styles = {
  root: clsx("w-full", "h-full", "animate-pulse", "bg-gray-100"),
};

// eslint-disable-next-line func-style
export function Skeleton() {
  return <div className={styles.root} aria-busy="true"></div>;
}
