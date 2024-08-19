import { clsx } from "clsx";
import { useRef } from "react";

export interface Props {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onCheck: () => void;
}

const styles = {
  input: clsx(
    "appearance-none",
    "m-0",
    "w-6",
    "h-6",
    "border-2",
    "border-primary-500",
    "rounded-full",
    "transition-all",
    "after:block",
    "after:rounded-full",
    "after:w-4",
    "after:h-4",
    "after:m-auto",
    "after:mt-[2px]",
    "checked:after:bg-primary-500",
    "hover:after:bg-primary-500/2"
  ),
  label: clsx("flex", "gap-1", "items-center", "text-primary-500"),
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
              props.onCheck();
            }
          }}
        />
        {props.label}
      </label>
    </span>
  );
}
