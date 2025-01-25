import { PropsWithChildren } from "react";
import * as styles from "./card-holder.css.js";

export interface Props {
  /**
   * type of holder
   */
  type: "player" | "inspector";
}

export const CardHolder = function CardHolder({ type, children }: PropsWithChildren<Props>): JSX.Element {
  return (
    <div className={styles.root} role="tablist">
      {type == "player" ? children : <p className={styles.inspector}>Inspector mode</p>}
    </div>
  );
};
