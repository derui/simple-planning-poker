import { equalStoryPoint, StoryPoint } from "./story-point";

type GiveUpCard = {
  kind: "giveup";
};

type StoryPointCard = {
  kind: "storypoint";
  storyPoint: StoryPoint;
};

export type Card = GiveUpCard | StoryPointCard;

/**
   factory function for GiveUpCard
 */
export const createGiveUpCard = (): GiveUpCard => {
  return {
    kind: "giveup",
  };
};

/**
   factory function for StoryPointCard
 */
export const createStoryPointCard = (storyPoint: StoryPoint): StoryPointCard => {
  return {
    kind: "storypoint",
    storyPoint,
  };
};

export const equalCard = (v1: Card, v2: Card) => {
  if (v1.kind !== v2.kind) {
    return false;
  }

  if (v1.kind === "giveup" && v2.kind === "giveup") {
    return true;
  } else if (v1.kind === "storypoint" && v2.kind === "storypoint") {
    return equalStoryPoint(v1.storyPoint, v2.storyPoint);
  }

  return false;
};
