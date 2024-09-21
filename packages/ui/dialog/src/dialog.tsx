import clsx from "clsx";
import { PropsWithChildren } from "react";

interface Props {
  title: string;
}

const styles = {
  root: clsx(
    "grid",
    "grid-rows-[auto_1fr]",
    "grid-cols-1",
    "w-96",
    "max-w-md",
    "m-auto",
    "border",
    "border-emerald-400",
    "rounded",
    "shadow-md",
    "z-0",
    "overflow-hidden"
  ),

  header: clsx(
    "row-start-1",
    "row-end-2",
    "flex",
    "flex-auto",
    "p-4",
    "h-16",
    "text-lg",
    "font-bold",
    "bg-emerald-100",
    "text-emerald-800"
  ),

  main: clsx("row-start-2", "row-end-4", "w-full", "h-full", "overflow-hidden"),
};

// eslint-disable-next-line func-style
export function Dialog(props: PropsWithChildren<Props>) {
  return (
    <div className={styles.root} role="dialog">
      <div className={styles.header}>{props.title}</div>
      <div className={styles.main} role="article">
        {props.children}
      </div>
    </div>
  );
}
