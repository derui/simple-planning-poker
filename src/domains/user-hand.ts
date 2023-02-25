import * as Card from "./card";

const UserHandUnselected = Symbol();
const UserHandGiveUp = Symbol();
const UserHandHanded = Symbol();

export const unselected = function unselected() {
  return { tag: UserHandUnselected } as const;
};

export const giveUp = function giveUp() {
  return { tag: UserHandGiveUp } as const;
};
export const handed = function handed(card: Card.T) {
  return {
    tag: UserHandHanded,
    card,
  } as const;
};

export type T = ReturnType<typeof unselected> | ReturnType<typeof giveUp> | ReturnType<typeof handed>;

export type Kind = "unselected" | "giveUp" | "handed";

export const kindOf = function kindOf(hand: T): Kind {
  switch (hand.tag) {
    case UserHandGiveUp:
      return "giveUp";
    case UserHandHanded:
      return "handed";
    case UserHandUnselected:
      return "unselected";
    default:
      throw new Error("unknown hand");
  }
};

export const isHanded = function isHanded(hand: T): hand is ReturnType<typeof handed> {
  return kindOf(hand) === "handed";
};

export const isGiveUp = function isGiveUp(hand: T): hand is ReturnType<typeof handed> {
  return kindOf(hand) === "giveUp";
};

export const isUnselected = function isUnselected(hand: T): hand is ReturnType<typeof handed> {
  return kindOf(hand) === "unselected";
};
