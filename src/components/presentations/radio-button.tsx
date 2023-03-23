import classNames from "classnames";
import { useRef } from "react";
import { BaseProps, generateTestId } from "../base";

export interface Props extends BaseProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onCheck: () => void;
}

const styles = {
  root: (checked: boolean) =>
    classNames(
      "inline-block",
      "flex-none",
      "border",
      "px-2",
      "py-1",
      "rounded-lg",
      "transition-colors",
      "bg-white",
      "cursor-pointer",
      {
        "border-primary-300": checked,
        "text-primary-500": checked,
      },
      {
        "border-secondary1-300": !checked,
        "text-secondary1-500": !checked,
        "hover:bg-secondary1-200": !checked,
      }
    ),
  input: classNames("hidden"),
  label: classNames("cursor-pointer"),
} as const;

// eslint-disable-next-line func-style
export function RadioButton(props: Props) {
  const gen = generateTestId(props.testid);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <span className={styles.root(props.checked ?? false)} data-testid={gen("root")}>
      <label
        className={styles.label}
        onClick={() => {
          ref.current?.click();
        }}
      >
        {props.label}
        <input
          ref={ref}
          className={styles.input}
          data-testid={gen("input")}
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          onChange={(e) => {
            if (e.target.value === props.value) {
              props.onCheck();
            }
          }}
        />
      </label>
    </span>
  );
}
