import { PropsWithChildren } from "react";
import * as styles from "./selectable-card.css.js";

interface Props {
  selected?: boolean;
  onSelect?: () => void;
}

// eslint-disable-next-line func-style
export function SelectableCard({ selected = false, children, onSelect }: PropsWithChildren<Props>) {
  return (
    <div
      className={selected ? styles.selected : styles.notSelected}
      onClick={onSelect}
      data-selected={selected}
      role="tab"
      aria-selected={selected}
    >
      {children}
    </div>
  );
}
