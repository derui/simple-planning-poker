import { DataSnapshot } from "firebase/database";
import { deserialize as deserializeEstimation, Serialized } from "./user-estimation-converter";
import * as Round from "@/domains/round";
import * as StoryPoint from "@/domains/story-point";
import * as SelectableCards from "@/domains/selectable-cards";
import * as User from "@/domains/user";
import { filterUndefined } from "@/utils/basic";
import { PlayerType, UserMode } from "@/domains/game-player";

/**
 * deserialize from firebase's snapshot
 */
export const deserializeFrom = function deserializeFrom(id: Round.Id, snapshot: DataSnapshot): Round.T | null {
  const val = snapshot.val();
  if (!val) {
    return null;
  }

  const count = val.count as number;
  const cards = val.cards as number[];
  const estimations = val.userEstimations as { [key: User.Id]: Serialized } | undefined;
  const finishedAt = val.finishedAt as string | undefined;
  const joinedPlayers = (val.joinedPlayers as Record<User.Id, { type: PlayerType; mode: UserMode }> | undefined) ?? {};

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
      count,
      finishedAt,
      cards: selectableCards,
      estimations: deserializedEstimations,
      joinedPlayers: Object.entries(joinedPlayers).map(([k, { mode, type }]) => ({
        type,
        user: User.createId(k),
        mode,
      })),
    });
  }

  return Round.roundOf({
    id,
    count,
    cards: selectableCards,
    estimations: deserializedEstimations,
    joinedPlayers: Object.entries(joinedPlayers).map(([k, { mode, type }]) => ({ type, user: User.createId(k), mode })),
  });
};
