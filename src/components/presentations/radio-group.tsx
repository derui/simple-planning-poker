import React, { PropsWithChildren } from "react";
import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";

type Props = BaseProps;

const styles = {
  root: classNames("flex", "flex-row", "items-center", "space-x-3", "m-2"),
} as const;

/**
 * RadioGroup should combine with RadioButton components. This component does not have any interaction, only definied styles wrapping up radio buttons.
 */
// eslint-disable-next-line func-style
export function RadioGroup(props: PropsWithChildren<Props>) {
  const gen = generateTestId(props.testid);

  return (
    <div className={styles.root} data-testid={gen("root")}>
      {props.children}
    </div>
  );
}
