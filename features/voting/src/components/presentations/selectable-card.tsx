import clsx from "clsx";
import { PropsWithChildren } from "react";

interface Props {
  selected?: boolean;
  onSelect?: () => void;
}

const styles = {
  root: (selected: boolean) =>
    clsx(
      "flex",
      "flex-col",
      "h-20",
      "w-14",
      "rounded",
      "border",
      "border-primary-400",
      "text-center",
      "justify-center",
      "m-3",
      "transition-transform",
      "first-of-type:ml-0",
      "last-of-type:mr-0",

      "hover:-translate-y-2",
      {
        "bg-white": !selected,
        "text-primary-400": !selected,
      },
      {
        "bg-primary-400": selected,
        "text-secondary1-200": selected,
        "-translate-y-2": selected,
      }
    ),
};

// eslint-disable-next-line func-style
export function SelectableCard(props: PropsWithChildren<Props>) {
  return (
    <div className={styles.root(props.selected ?? false)} onClick={props.onSelect} data-selected={props.selected}>
      {props.children}
    </div>
  );
}
