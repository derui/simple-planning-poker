import { DataSnapshot } from "firebase/database";
import { deserialize as deserializeEstimation, Serialized } from "./user-estimation-converter";
import * as Round from "@/domains/round";
import * as StoryPoint from "@/domains/story-point";
import * as SelectableCards from "@/domains/selectable-cards";
import * as User from "@/domains/user";
import { filterUndefined } from "@/utils/basic";

/**
 * deserialize from firebase's snapshot
 */
export const deserializeFrom = function deserializeFrom(id: Round.Id, snapshot: DataSnapshot): Round.T | null {
  const val = snapshot.val();
  if (!val) {
    return null;
  }

  const cards = val.cards as number[];
  const estimations = val.userEstimations as { [key: User.Id]: Serialized } | undefined;
  const finishedAt = val.finishedAt as string | undefined;

  const selectableCards = SelectableCards.create(cards.map(StoryPoint.create));
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
    return Round.finishedRoundOf({
      id,
      finishedAt,
      cards: selectableCards,
      estimations: deserializedEstimations,
    });
  }

  return Round.roundOf({
    id,
    cards: selectableCards,
    estimations: deserializedEstimations,
  });
};
