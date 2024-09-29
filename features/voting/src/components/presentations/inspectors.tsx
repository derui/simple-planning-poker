import { clsx } from "clsx";
import { PropsWithChildren, Children } from "react";

const styles = {
  root: clsx("flex", "flex-row", "gap-2", "bg-indigo-100", "justify-center"),
  emptyText: clsx("text-indigo-500", "font-bold", "text-lg", "m-7"),
} as const;

export const Inspectors = function Inspectors(props: PropsWithChildren) {
  const childrenCount = Children.count(props.children);
  if (childrenCount == 0) {
    return (
      <div className={styles.root}>
        <p className={styles.emptyText}>No inspectors</p>
      </div>
    );
  }

  return <div className={styles.root}>{props.children}</div>;
};
