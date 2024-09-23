import clsx from "clsx";
import { Skeleton } from "@spp/ui-skeleton";
import { PropsWithChildren } from "react";

interface Props {
  loading?: boolean;
}

const styles = {
  root: clsx(
    "grid",
    "grid-rows-1",
    "grid-cols-[auto_auto_auto_auto]",
    "auto-cols-min",
    "place-content-center",
    "gap-4",
    "min-h-12",
    "w-full"
  ),
  loading: clsx("grid", "grid-rows-1", "grid-cols-1", "place-content-center", "gap-4", "min-h-12", "w-full"),
};

/**
 * Container presentation for player estimations
 */
// eslint-disable-next-line func-style
export function PlayerEstimations({ loading, children }: PropsWithChildren<Props>) {
  if (loading) {
    return (
      <div className={styles.loading} data-loading="true">
        <Skeleton />
      </div>
    );
  }

  return <div className={styles.root}>{children}</div>;
}
