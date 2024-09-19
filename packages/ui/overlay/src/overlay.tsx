import { clsx } from "clsx";
import { PropsWithChildren } from "react";

export interface Props {
  show: boolean;
}

const styles = {
  root: (show: boolean) =>
    clsx(
      "absolute",
      "z-10",
      "bg-gray-500/80",
      "w-full",
      "h-full",
      "top-0",
      "left-0",
      "transition-all",
      "flex",
      "items-center",
      "justify-center",
      {
        ["invisible"]: !show,
        "-z-50": !show,
        "opacity-0": !show,
      }
    ),
} as const;

// eslint-disable-next-line func-style
export function Overlay(props: PropsWithChildren<Props>) {
  return (
    <div className={styles.root(props.show)} role="dialog" data-show={props.show}>
      {props.children}
    </div>
  );
}
