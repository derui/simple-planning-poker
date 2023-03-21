import * as Card from "./card";
import { Branded } from "./type";

const UserEstimation = Symbol();
type UserEstimation = typeof UserEstimation;

interface Unselected {
  _tag: "unselected";
}

interface Giveup {
  _tag: "giveup";
}
interface Estimated {
  _tag: "estimated";
  card: Card.T;
}

export type T = Branded<Unselected | Giveup | Estimated, UserEstimation>;

export const unselected = function unselected(): T {
  return { _tag: "unselected" } as T;
};

export const giveUp = function giveUp(): T {
  return { _tag: "giveup" } as T;
};
export const estimated = function estimated(card: Card.T): T {
  return {
    _tag: "estimated",
    card,
  } as T;
};

export type Kind = "unselected" | "giveup" | "estimated";

export const kindOf = function kindOf(hand: T): Kind {
  switch (hand._tag) {
    case "giveup":
      return "giveup";
    case "estimated":
      return "estimated";
    case "unselected":
      return "unselected";
    default:
      throw new Error("unknown hand");
  }
};

export const isEstimated = function isEstimated(hand: T): hand is Branded<Estimated, typeof UserEstimation> {
  return kindOf(hand) === "estimated";
};

export const isGiveUp = function isGiveUp(hand: T): hand is Branded<Giveup, typeof UserEstimation> {
  return kindOf(hand) === "giveup";
};

export const isUnselected = function isUnselected(hand: T): hand is Branded<Unselected, typeof UserEstimation> {
  return kindOf(hand) === "unselected";
};
