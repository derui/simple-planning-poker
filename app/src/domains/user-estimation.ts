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

export const kindOf = function kindOf(estimation: T): Kind {
  switch (estimation._tag) {
    case "giveup":
      return "giveup";
    case "estimated":
      return "estimated";
    case "unselected":
      return "unselected";
    default:
      throw new Error("unknown estimation");
  }
};

export const isEstimated = function isEstimated(
  estimation: T
): estimation is Branded<Estimated, typeof UserEstimation> {
  return kindOf(estimation) === "estimated";
};

export const isGiveUp = function isGiveUp(estimation: T): estimation is Branded<Giveup, typeof UserEstimation> {
  return kindOf(estimation) === "giveup";
};

export const isUnselected = function isUnselected(
  estimation: T
): estimation is Branded<Unselected, typeof UserEstimation> {
  return kindOf(estimation) === "unselected";
};
