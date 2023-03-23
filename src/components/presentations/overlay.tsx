import classNames from "classnames";
import { PropsWithChildren } from "react";
import { BaseProps, generateTestId } from "../base";

export interface Props extends BaseProps {
  show: boolean;
}

const styles = {
  root: (show: boolean) =>
    classNames(
      "absolute",
      "z-10",
      "bg-gray/20",
      "w-full",
      "h-full",
      "top-0",
      "left-0",
      "transition-all",
      "flex",
      "items-center",
      "justify-center",
      {
        invisible: !show,
        "-z-50": !show,
        "opacity-0": !show,
      }
    ),
} as const;

// eslint-disable-next-line func-style
export function Overlay(props: PropsWithChildren<Props>) {
  const gen = generateTestId(props.testid);

  return (
    <div className={styles.root(props.show)} data-testid={gen("root")} data-show={props.show}>
      {props.children}
    </div>
  );
}
