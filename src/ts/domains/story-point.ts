export type StoryPoint = {
  get value(): number;
};

export const createStoryPoint = (v: number): StoryPoint => {
  if (!isValidStoryPoint(v)) {
    throw new Error("Can not create story point");
  }

  return {
    get value() {
      return v;
    },
  };
};

export const isValidStoryPoint = (v: number): boolean => {
  return v > 0 && !isNaN(v);
};

export const equalStoryPoint = (v1: StoryPoint, v2: StoryPoint): boolean => v1.value === v2.value;
export const compareStoryPoint = (v1: StoryPoint, v2: StoryPoint): number => {
  if (equalStoryPoint(v1, v2)) {
    return 0;
  } else if (v1.value > v2.value) {
    return 1;
  } else {
    return -1;
  }
};
