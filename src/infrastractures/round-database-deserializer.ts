import { DataSnapshot } from "firebase/database";
import { deserialize as deserializeHand, Serialized } from "./user-hand-converter";
import * as Round from "@/domains/round";
import * as StoryPoint from "@/domains/story-point";
import * as SelectableCards from "@/domains/selectable-cards";
import * as User from "@/domains/user";
import { filterUndefined } from "@/utils/basic";
import { UserMode } from "@/domains/game-player";

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
  const hands = val.userHands as { [key: User.Id]: Serialized } | undefined;
  const finishedAt = val.finishedAt as string | undefined;
  const joinedPlayers = (val.joinedPlayers as Record<User.Id, UserMode> | undefined) ?? {};

  const selectableCards = SelectableCards.create(cards.map(StoryPoint.create));
  const deserializedHands = hands
    ? Object.entries(hands)
        .map(([k, hand]) => {
          if (!hand) {
            return undefined;
          }
          return {
            user: User.createId(k),
            hand: deserializeHand(hand),
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
      hands: deserializedHands,
    });
  }

  return Round.roundOf({
    id,
    count,
    cards: selectableCards,
    hands: deserializedHands,
    joinedPlayers: Object.entries(joinedPlayers).map(([k, v]) => ({ user: User.createId(k), mode: v })),
  });
};
