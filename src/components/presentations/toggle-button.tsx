import classNames from "classnames";
import { useRef, useState } from "react";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  initialChecked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

const styles = {
  root: classNames("flex", "flex-auto", "flex-col", "border", "border-secondary1-500"),
  label: classNames("flex-none", "text-center", "px-4", "py-3", "bg-secondary1-500", "text-secondary1-200"),
  container: classNames("flex", "flex-auto", "w-40", "outline-none", "border-none", "p-0"),
  switchLabel: classNames("flex-auto", "text-primary-500", "text-center"),
  switch: classNames("flex-none", "relative", "inline-block", "bg-transparent", "w-6", "max-w-6", "h-4"),
  switchRail: (checked: boolean) =>
    classNames("relative", "inline-block", "m-0", "px-1", "bg-secondary1-300", "w-full", "h-full", "transition-color", {
      "bg-secondary1-400": checked,
    }),
  switchBox: (checked: boolean) =>
    classNames(
      "absolute",
      "inline-block",
      "bg-primary-400",
      "h-full",
      "w-3",
      "left-0",
      "top-0",
      "transition-transform",
      {
        "[transform:translateX(w-3)]": checked,
      }
    ),
  switchInput: classNames("hidden"),
};

// eslint-disable-next-line func-style
export function ToggleButton(props: Props) {
  const testid = generateTestId(props.testid);
  const ref = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(props.initialChecked);

  return (
    <div className={styles.root} data-testid={testid("root")}>
      <label className={styles.label} data-testid={testid("label")}>
        {props.label}
      </label>
      <div className={styles.container}>
        <span className={styles.switchLabel}>Off</span>
        <span className={styles.switch}>
          <span
            className={styles.switchRail(checked)}
            data-testid={testid("rail")}
            onClick={() => ref?.current?.click()}
          >
            <span className={styles.switchBox(checked)}></span>
          </span>
          <input
            data-testid={testid("input")}
            ref={ref}
            className={styles.switchInput}
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);

              props.onChange(e.target.checked);
            }}
          />
        </span>
        <span className={styles.label}>On</span>
      </div>
    </div>
  );
}
