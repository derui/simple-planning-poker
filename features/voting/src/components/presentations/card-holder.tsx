import { clsx } from "clsx";
import { PropsWithChildren } from "react";

export interface Props {
  /**
   * type of holder
   */
  type: "player" | "inspector";
}

const styles = {
  root: clsx("flex", "flex-row", "items-center", "justify-center", "h-36", "bg-emerald-50", "w-full"),
  inspector: clsx("font-bold", "text-emerald-700", "text-xl"),
} as const;

export const CardHolder = function CardHolder({ type, children }: PropsWithChildren<Props>) {
  return (
    <div className={styles.root} role="tablist">
      {type == "player" ? children : <p className={styles.inspector}>Inspector mode</p>}
    </div>
  );
};
