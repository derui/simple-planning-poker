import * as Card from "@/domains/card";
import * as UserEstimation from "@/domains/user-estimation";
import * as StoryPoint from "@/domains/story-point";

export type Serialized =
  | {
      kind: "giveUp";
    }
  | { kind: "selected"; storypoint: number }
  | { kind: "unselected" };

export const serialize = function serializeUserHand(hand: UserEstimation.T): Serialized {
  switch (UserEstimation.kindOf(hand)) {
    case "giveup":
      return { kind: "giveUp" };
    case "unselected":
      return { kind: "unselected" };
    case "estimated":
      if (UserEstimation.isEstimated(hand)) {
        return { kind: "selected", storypoint: hand.card };
      }
    default:
      throw new Error("unknown hand");
  }
};

export const deserialize = function deserializeUserHand(obj: Serialized): UserEstimation.T {
  switch (obj.kind) {
    case "giveUp":
      return UserEstimation.giveUp();
    case "unselected":
      return UserEstimation.unselected();
    case "selected":
      return UserEstimation.estimated(Card.create(StoryPoint.create(obj.storypoint)));
  }
};
