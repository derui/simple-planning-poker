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
    "w-full"
  ),
};

/**
 * Container presentation for player estimations
 */
// eslint-disable-next-line func-style
export function PlayerEstimations({ loading, children }: PropsWithChildren<Props>) {
  if (loading) {
    return (
      <div className={styles.root} data-loading="true">
        <Skeleton />
      </div>
    );
  }

  return <div className={styles.root}>{children}</div>;
}
