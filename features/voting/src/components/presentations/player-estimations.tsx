import clsx from "clsx";
import { Skeleton } from "@spp/ui-skeleton";
import { useMemo } from "react";
import { EstimationDto } from "../../atoms/dto.js";
import { PlayerEstimation } from "./player-estimation.js";

interface Props {
  loading?: boolean;
  total: number;
  estimations: EstimationDto[];
}

const styles = {
  root: clsx("grid", "grid-rows-[auto_1fr]", "grid-cols-1", "place-items-center", "gap-4"),
  loading: clsx("grid", "grid-rows-1", "grid-cols-1", "place-content-center", "h-24", "w-full"),
  estimations: clsx("flex", "flex-row", "gap-4"),
  voting: {
    root: clsx("flex", "flex-row", "items-center", "justify-center", "h-8"),
    label: clsx("text-2xl", "font-bold", "text-emerald-700", "mr-4", "flex-none"),
    estimated: (allEstimated: boolean) =>
      clsx("flex-auto", "text-xl", "rounded", "px-2", "py-1", "border", "transition", {
        "text-gray-800": !allEstimated,
        "border-gray-400": !allEstimated,
        "text-emerald-700": allEstimated,
        "font-bold": allEstimated,
        "bg-cerise-100": allEstimated,
        "border-cerise-400": allEstimated,
      }),
  },
} as const;

/**
 * Container presentation for player estimations
 */
// eslint-disable-next-line func-style
export function PlayerEstimations({ loading, total, estimations }: Props) {
  const estimated = useMemo(() => estimations.filter((v) => v.estimated).length, [estimations]);

  if (loading) {
    return (
      <div className={styles.loading} data-loading="true">
        <Skeleton />
      </div>
    );
  }

  const allEstimated = total == estimated;

  return (
    <div className={styles.root}>
      <div className={styles.voting.root}>
        <span className={styles.voting.label}>Voted</span>
        <span className={styles.voting.estimated(allEstimated)}>
          {estimated} / {total}
        </span>
      </div>
      <div className={styles.estimations}>
        {estimations.map((estimation, index) => {
          return <PlayerEstimation key={index} {...estimation}></PlayerEstimation>;
        })}
      </div>
    </div>
  );
}
