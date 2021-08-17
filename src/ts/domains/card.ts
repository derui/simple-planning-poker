type GiveUpCard = {
  kind: "giveup";
};

type StoryPointCard = {
  kind: "storypoint";
  storyPoint: number;
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
export const createStoryPointCard = (storyPoint: number): StoryPointCard => {
  if (storyPoint <= 0 || isNaN(storyPoint)) {
    throw new Error(`Can not create story point card with ${storyPoint}`);
  }

  return {
    kind: "storypoint",
    storyPoint,
  };
};
