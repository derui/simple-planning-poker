import clsx from "clsx";
import { Skeleton } from "@spp/ui-skeleton";
import { useMemo } from "react";
import { EstimationDto } from "../../atoms/dto.js";
import { PlayerEstimation } from "./player-estimation.js";
import { buttonStyle } from "@spp/ui-button-style";
import { Variant } from "@spp/shared-color-variant";

interface Props {
  loading?: boolean;
  total: number;
  estimations: EstimationDto[];
  revealable?: boolean;
  onReveal?: () => void;
}

const styles = {
  root: clsx("grid", "grid-rows-[auto_auto_1fr]", "grid-cols-1", "place-items-center", "gap-4"),
  loading: clsx("grid", "grid-rows-1", "grid-cols-1", "place-content-center", "h-24", "w-full"),
  estimations: clsx("flex", "flex-row", "gap-4"),
  voting: {
    root: clsx("flex", "flex-row", "items-center", "justify-center", "h-16"),
    label: clsx("text-2xl", "font-bold", "text-emerald-700", "mr-4", "flex-none"),
    estimated: (allEstimated: boolean) =>
      clsx("flex-auto", "text-xl", "rounded", "px-4", "py-2", "border", "transition", {
        "text-gray-800": !allEstimated,
        "border-gray-400": !allEstimated,
        "text-emerald-700": allEstimated,
        "font-bold": allEstimated,
        "bg-cerise-100": allEstimated,
        "border-cerise-400": allEstimated,
      }),
    revealButton: (revealable: boolean) => clsx(buttonStyle({ variant: Variant.emerald, disabled: !revealable })),
    reveal: clsx("flex", "flex-auto", "ml-4"),
  },
} as const;

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
      <div className={styles.voting.root}>
        <span className={styles.voting.label}>Voted</span>
        <span className={styles.voting.estimated(allEstimated)}>
          {estimated} / {total}
        </span>
      </div>
      <div className={styles.voting.reveal}>
        <button className={styles.voting.revealButton(revealable)} onClick={handleReveal} disabled={!revealable}>
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
