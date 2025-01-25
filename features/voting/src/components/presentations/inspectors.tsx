import { Children, PropsWithChildren } from "react";
import * as styles from "./inspectors.css.js";

export const Inspectors = function Inspectors(props: PropsWithChildren): JSX.Element {
  const childrenCount = Children.count(props.children);
  if (childrenCount == 0) {
    return (
      <div className={styles.root}>
        <p className={styles.emptyText}>No inspectors</p>
      </div>
    );
  }

  return <div className={styles.root}>{props.children}</div>;
};
