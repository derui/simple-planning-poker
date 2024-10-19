import clsx from "clsx";
import { PropsWithChildren } from "react";

interface Props {
  selected?: boolean;
  onSelect?: () => void;
}

const styles = {
  root: (selected: boolean) =>
    clsx(
      "grid",
      "place-content-center",
      "cursor-pointer",
      "h-20",
      "w-14",
      "rounded",
      "border-2",
      "border-orange-400",
      "m-3",
      "transition-transform",
      "first-of-type:ml-0",
      "last-of-type:mr-0",

      "hover:-translate-y-2",
      "text-orange-700",
      {
        "bg-white": !selected,
        "bg-orange-200": selected,
        "-translate-y-2": selected,
      }
    ),
};

// eslint-disable-next-line func-style
export function SelectableCard(props: PropsWithChildren<Props>) {
  return (
    <div
      className={styles.root(props.selected ?? false)}
      onClick={props.onSelect}
      data-selected={props.selected}
      role="tab"
      aria-selected={props.selected}
    >
      {props.children}
    </div>
  );
}
