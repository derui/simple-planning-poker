import { DataSnapshot } from "firebase/database";
import { deserialize as deserializeEstimation, Serialized } from "./user-estimation-converter";
import { Voting, StoryPoint, ApplicablePoints, User } from "@spp/shared-domain";
import { filterUndefined } from "@spp/shared-basic";

/**
 * deserialize from firebase's snapshot
 */
export const deserializeFrom = function deserializeFrom(id: Voting.Id, snapshot: DataSnapshot): Voting.T | null {
  const val = snapshot.val();
  if (!val) {
    return null;
  }

  const points = val.cards as number[];
  const estimations = val.userEstimations as { [key: User.Id]: Serialized } | undefined;
  const finishedAt = val.finishedAt as string | undefined;
  const theme = val.theme as string | undefined;

  const selectableCards = ApplicablePoints.create(points.map(StoryPoint.create));
  const deserializedEstimations = estimations
    ? Object.entries(estimations)
        .map(([k, estimation]) => {
          if (!estimation) {
            return undefined;
          }
          return {
            user: User.createId(k),
            estimation: deserializeEstimation(estimation),
          };
        })
        .filter(filterUndefined)
    : [];

  if (finishedAt) {
    return Voting.revealedOf({
      id,
      finishedAt,
      points: selectableCards,
      estimations: deserializedEstimations,
      theme,
    });
  }

  return Voting.votingOf({
    id,
    points: selectableCards,
    estimations: deserializedEstimations,
    theme,
  });
};
