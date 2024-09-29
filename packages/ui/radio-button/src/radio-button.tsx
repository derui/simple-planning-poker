import { clsx } from "clsx";
import { useRef } from "react";

export interface Props {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange: () => void;
}

const styles = {
  input: clsx(
    "appearance-none",
    "relative",
    "m-0",
    "w-6",
    "h-6",
    "border-2",
    "border-emerald-500",
    "rounded-full",
    "transition-all",
    "after:block",
    "after:absolute",
    "after:rounded-full",
    "after:w-4",
    "after:h-4",
    "after:m-auto",
    "after:top-0.5",
    "after:left-0.5",
    "checked:after:bg-emerald-500",
    "hover:after:bg-emerald-500/2"
  ),
  label: clsx("flex", "gap-1", "items-center", "text-emerald-500"),
} as const;

// eslint-disable-next-line func-style
export function RadioButton(props: Props) {
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
