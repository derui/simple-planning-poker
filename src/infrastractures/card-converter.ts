import { T, createGiveUpCard, create } from "@/domains/card";
import { create } from "@/domains/story-point";

export type SerializedCard =
  | {
      kind: "giveup";
    }
  | { kind: "storypoint"; storypoint: number };

export const serializeCard = (card: T): SerializedCard => {
  switch (card.kind) {
    case "giveup":
      return { kind: "giveup" };
    case "storypoint":
      return { kind: "storypoint", storypoint: card.storyPoint.value };
  }
};

export const deserializeCard = (card: SerializedCard): T => {
  switch (card.kind) {
    case "giveup":
      return createGiveUpCard();
    case "storypoint":
      return create(create(card.storypoint));
  }
};
