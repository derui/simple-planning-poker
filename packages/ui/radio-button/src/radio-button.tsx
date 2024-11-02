import { useRef } from "react";
import * as styles from "./style.css.js";

export interface Props {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange: () => void;
}

// eslint-disable-next-line func-style
export function RadioButton(props: Props): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <span>
      <label
        className={styles.label}
        onClick={() => {
          ref.current?.click();
        }}
      >
        <input
          ref={ref}
          className={styles.input}
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          onChange={(e) => {
            if (e.target.value === props.value) {
              props.onChange();
            }
          }}
        />
        {props.label}
      </label>
    </span>
  );
}
