import { PropsWithChildren } from "react";
import * as styles from "./style.css.js";

/**
 * RadioGroup should combine with RadioButton components. This component does not have any interaction, only definied styles wrapping up radio buttons.
 */
// eslint-disable-next-line func-style
export function RadioGroup(props: PropsWithChildren): JSX.Element {
  return (
    <div className={styles.root} role="radiogroup">
      {props.children}
    </div>
  );
}
