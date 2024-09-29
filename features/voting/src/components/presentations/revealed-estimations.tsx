import clsx from "clsx";
import { Skeleton } from "@spp/ui-skeleton";
import { RevealedEstimationDto } from "../../atoms/dto.js";
import { RevealedEstimation } from "./revealed-estimation.js";

interface Props {
  loading?: boolean;
  average?: number;
  estimations: RevealedEstimationDto[];
}

const styles = {
  root: clsx("grid", "grid-rows-[auto_1fr]", "grid-cols-1", "place-items-center", "gap-4"),
  loading: clsx("grid", "grid-rows-1", "grid-cols-1", "place-content-center", "h-24", "w-full"),
  estimations: clsx("flex", "flex-row", "gap-4"),
  voting: {
    root: clsx("flex", "flex-row", "items-center", "justify-center", "h-8"),
    label: clsx("text-2xl", "font-bold", "text-emerald-700", "mr-4", "flex-none"),
    average: clsx(
      "flex-auto",
      "text-xl",
      "rounded",
      "px-2",
      "py-1",
      "border",
      "transition",
      "font-bold",
      "bg-cerise-100",
      "border-cerise-400",
      "text-emerald-700"
    ),
  },
} as const;

/**
 * Container presentation for revealed estimations
 */
// eslint-disable-next-line func-style
export function RevealedEstimations({ loading, average, estimations }: Props) {
  if (loading) {
    return (
      <div className={styles.loading} data-loading="true">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.voting.root}>
        <span className={styles.voting.label}>Estimation(Average):</span>
        <span className={styles.voting.average}>{(average ?? 0).toPrecision(2)}</span>
      </div>
      <div className={styles.estimations}>
        {estimations.map((estimation, index) => {
          return (
            <RevealedEstimation key={index} name={estimation.name}>
              {estimation.estimated}
            </RevealedEstimation>
          );
        })}
      </div>
    </div>
  );
}
