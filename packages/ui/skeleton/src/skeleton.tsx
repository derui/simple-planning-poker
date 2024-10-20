import * as styles from "./style.css.js";

// eslint-disable-next-line func-style
export function Skeleton() {
  return <div className={styles.root} aria-busy="true"></div>;
}
