import { EstimationDto } from "../../atoms/dto.js";
import { RevealedEstimation } from "./revealed-estimation.js";
import * as styles from "./revealed-estimations.css.js";

interface Props {
  average?: number;
  estimations: EstimationDto[];
  onReset?: () => void;
}

/**
 * Container presentation for revealed estimations
 */
// eslint-disable-next-line func-style
export function RevealedEstimations({ average, estimations, onReset }: Props): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.votingRoot}>
        <span className={styles.votingLabel}>Estimation(Average):</span>
        <span className={styles.votingAverage}>{(average ?? 0).toPrecision(2)}</span>
      </div>
      <div className={styles.estimations}>
        {estimations.map((estimation, index) => {
          return (
            <RevealedEstimation key={index} name={estimation.name}>
              {estimation.estimated ?? "?"}
            </RevealedEstimation>
          );
        })}
      </div>
      <div className={styles.reset}>
        <button className={styles.resetButton} onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
