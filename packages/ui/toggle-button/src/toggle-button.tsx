import { clsx } from "clsx";
import { useRef, useState } from "react";

interface Props {
  initialChecked: boolean;
  onToggle: (checked: boolean) => void;
}

const styles = {
  container: clsx("flex", "flex-none", "outline-none", "border-none", "p-0", "h-8", "items-center", "rounded"),
  switch: {
    root: clsx("flex", "relative", "inline-block", "bg-transparent", "h-6", "justify-items-center"),
    rail: (checked: boolean) =>
      clsx(
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
      clsx("absolute", "inline-block", "bg-primary-400", "h-full", "w-6", "left-0", "top-0", "transition-transform", {
        "translate-x-6": checked,
        "rounded-l": !checked,
        "rounded-r": checked,
      }),
    input: clsx("hidden"),
  },
};

// eslint-disable-next-line func-style
export function ToggleButton(props: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(props.initialChecked);

  return (
    <span className={styles.container} role="switch" onClick={() => ref?.current?.click()}>
      <span className={styles.switch.root}>
        <span className={styles.switch.rail(checked)}>
          <span className={styles.switch.box(checked)}></span>
        </span>
        <input
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
    </span>
  );
}
