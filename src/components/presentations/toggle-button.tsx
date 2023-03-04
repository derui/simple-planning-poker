import classNames from "classnames";
import { useRef, useState } from "react";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  initialChecked: boolean;
  onToggle: (checked: boolean) => void;
}

const styles = {
  container: classNames(
    "flex",
    "flex-auto",
    "w-full",
    "outline-none",
    "border-none",
    "p-0",
    "h-8",
    "items-center",
    "rounded"
  ),
  switch: {
    root: classNames(
      "flex",
      "relative",
      "inline-block",
      "bg-transparent",
      "w-full",
      "max-w-full",
      "h-6",
      "justify-items-center"
    ),
    rail: (checked: boolean) =>
      classNames(
        "relative",
        "inline-block",
        "m-0",
        "px-1",
        "bg-secondary1-300",
        "w-12",
        "h-full",
        "transition-colors",
        "overflow-hidden",
        "rounded",
        {
          "bg-secondary1-400": checked,
        }
      ),
    box: (checked: boolean) =>
      classNames(
        "absolute",
        "inline-block",
        "bg-primary-400",
        "h-full",
        "w-6",
        "left-0",
        "top-0",
        "transition-transform",
        {
          "translate-x-6": checked,
          "rounded-l": !checked,
          "rounded-r": checked,
        }
      ),
    input: classNames("hidden"),
  },
};

// eslint-disable-next-line func-style
export function ToggleButton(props: Props) {
  const testid = generateTestId(props.testid);
  const ref = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(props.initialChecked);

  return (
    <div data-testid={testid("root")} className={styles.container}>
      <span className={styles.switch.root}>
        <span
          className={styles.switch.rail(checked)}
          data-testid={testid("rail")}
          onClick={() => ref?.current?.click()}
        >
          <span className={styles.switch.box(checked)}></span>
        </span>
        <input
          data-testid={testid("input")}
          ref={ref}
          className={styles.switch.input}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);

            if (props.onToggle) {
              props.onToggle(e.target.checked);
            }
          }}
        />
      </span>
    </div>
  );
}
