import { PropsWithChildren } from "react";
import { clsx } from "clsx";

const styles = {
  root: clsx("flex", "flex-row", "items-center", "gap-x-3", "m-2"),
} as const;

/**
 * RadioGroup should combine with RadioButton components. This component does not have any interaction, only definied styles wrapping up radio buttons.
 */
// eslint-disable-next-line func-style
export function RadioGroup(props: PropsWithChildren) {
  return (
    <div className={styles.root} role="radiogroup">
      {props.children}
    </div>
  );
}
