import * as Card from "./card";
import { Branded } from "./type";

const UserHand = Symbol();
type UserHand = typeof UserHand;

interface Unselected {
  _tag: "unselected";
}

interface Giveup {
  _tag: "giveup";
}
interface Handed {
  _tag: "handed";
  card: Card.T;
}

export type T = Branded<Unselected | Giveup | Handed, UserHand>;

export const unselected = function unselected(): T {
  return { _tag: "unselected" } as T;
};

export const giveUp = function giveUp(): T {
  return { _tag: "giveup" } as T;
};
export const handed = function handed(card: Card.T): T {
  return {
    _tag: "handed",
    card,
  } as T;
};

export type Kind = "unselected" | "giveup" | "handed";

export const kindOf = function kindOf(hand: T): Kind {
  switch (hand._tag) {
    case "giveup":
      return "giveup";
    case "handed":
      return "handed";
    case "unselected":
      return "unselected";
    default:
      throw new Error("unknown hand");
  }
};

export const isHanded = function isHanded(hand: T): hand is Branded<Handed, typeof UserHand> {
  return kindOf(hand) === "handed";
};

export const isGiveUp = function isGiveUp(hand: T): hand is Branded<Giveup, typeof UserHand> {
  return kindOf(hand) === "giveup";
};

export const isUnselected = function isUnselected(hand: T): hand is Branded<Unselected, typeof UserHand> {
  return kindOf(hand) === "unselected";
};
