import { useEffect, useRef, useState } from "react";
import * as styles from "./style.css.js";

interface Props {
  initialChecked?: boolean;

  /**
   * Event to notify change state.
   */
  onToggle?: (checked: boolean) => void;
}

// eslint-disable-next-line func-style
export function ToggleButton(props: Props): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(props.initialChecked ?? false);

  useEffect(() => {
    setChecked(props.initialChecked ?? false);
  }, [props.initialChecked]);

  return (
    <span className={styles.container} role="switch" onClick={() => ref?.current?.click()}>
      <span className={styles.toggleRoot}>
        <span className={checked ? styles.switchRailChecked : styles.switchRailUnchecked}>
          <span className={checked ? styles.switchBoxChecked : styles.switchBox}></span>
        </span>
        <input
          ref={ref}
          className={styles.input}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);

            props.onToggle?.(e.target.checked);
          }}
        />
      </span>
    </span>
  );
}
