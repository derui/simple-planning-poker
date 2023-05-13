import { DataSnapshot } from "firebase/database";
import * as RoundHistory from "@/status/query-models/round-history";

/**
 * deserialize from firebase's snapshot
 */
export const deserializeFrom = function deserializeFrom(snapshot: DataSnapshot): RoundHistory.T | null {
  const val = snapshot.val();
  const key = snapshot.key;
  if (!val || !key) {
    return null;
  }

  const finishedAt = val.finishedAt as string;
  const theme = val.theme as string | undefined;
  const averagePoint = val.averagePoint as number;

  return {
    id: key,
    finishedAt,
    averagePoint: averagePoint,
    theme: theme ?? null,
  };
};
