import { Skeleton } from "@spp/ui-skeleton";
import { useMemo } from "react";
import { EstimationDto } from "../../atoms/dto.js";
import { PlayerEstimation } from "./player-estimation.js";
import * as styles from "./player-estimations.css.js";

interface Props {
  loading?: boolean;
  total: number;
  estimations: EstimationDto[];
  revealable?: boolean;
  onReveal?: () => void;
}

/**
 * Container presentation for player estimations
 */
// eslint-disable-next-line func-style
export function PlayerEstimations({ loading, total, estimations, onReveal, revealable = false }: Props) {
  const estimated = useMemo(() => estimations.filter((v) => v.estimated).length, [estimations]);

  if (loading) {
    return (
      <div className={styles.loading} data-loading="true">
        <Skeleton />
      </div>
    );
  }

  const handleReveal = () => {
    onReveal?.();
  };

  const allEstimated = total == estimated;

  return (
    <div className={styles.root}>
      <div className={styles.votingRoot}>
        <span className={styles.votingLabel}>Voted</span>
        <span className={allEstimated ? styles.votingEstimatedAllEstimated : styles.votingEstimatedNotAllEstimated}>
          {estimated} / {total}
        </span>
      </div>
      <div className={styles.votingReveal}>
        <button
          className={revealable ? styles.votingRevealButtonEnabled : styles.votingRevealButtonDisbled}
          onClick={handleReveal}
          disabled={!revealable}
        >
          Reveal
        </button>
      </div>
      <div className={styles.estimations}>
        {estimations.map((estimation, index) => {
          return <PlayerEstimation key={index} {...estimation}></PlayerEstimation>;
        })}
      </div>
    </div>
  );
}
