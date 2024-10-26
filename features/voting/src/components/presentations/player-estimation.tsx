import * as styles from "./player-estimation.css.js";

interface Props {
  name: string;
  estimated?: boolean;
}

// eslint-disable-next-line func-style
export function PlayerEstimation(props: Props) {
  const { estimated = false } = props;

  const estimationClass = estimated ? styles.cardEstimated : styles.cardNotEstimated;

  return (
    <div className={styles.root}>
      <span>{props.name}</span>
      <span className={estimationClass} data-estimated={estimated}></span>
    </div>
  );
}
