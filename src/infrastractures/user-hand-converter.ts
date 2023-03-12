import * as Card from "@/domains/card";
import * as UserHand from "@/domains/user-hand";
import * as StoryPoint from "@/domains/story-point";

export type Serialized =
  | {
      kind: "giveUp";
    }
  | { kind: "selected"; storypoint: number }
  | { kind: "unselected" };

export const serialize = function serializeUserHand(hand: UserHand.T): Serialized {
  switch (UserHand.kindOf(hand)) {
    case "giveup":
      return { kind: "giveUp" };
    case "unselected":
      return { kind: "unselected" };
    case "handed":
      if (UserHand.isHanded(hand)) {
        return { kind: "selected", storypoint: hand.card };
      }
    default:
      throw new Error("unknown hand");
  }
};

export const deserialize = function deserializeUserHand(obj: Serialized): UserHand.T {
  switch (obj.kind) {
    case "giveUp":
      return UserHand.giveUp();
    case "unselected":
      return UserHand.unselected();
    case "selected":
      return UserHand.handed(Card.create(StoryPoint.create(obj.storypoint)));
  }
};
