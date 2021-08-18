import { StoryPoint } from "./story-point";

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
