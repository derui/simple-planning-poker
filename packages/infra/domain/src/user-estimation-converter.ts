import { UserEstimation, StoryPoint } from "@spp/shared-domain";

export type Serialized =
  | {
      kind: "giveUp";
    }
  | { kind: "submitted"; storypoint: number }
  | { kind: "unsubmit" };

export const serialize = function serializeEstimation(estimation: UserEstimation.T): Serialized {
  if (UserEstimation.isGiveUp(estimation)) {
    return { kind: "giveUp" };
  } else if (UserEstimation.isUnsubmit(estimation)) {
    return { kind: "unsubmit" };
  } else if (UserEstimation.isSubmitted(estimation)) {
    return { kind: "submitted", storypoint: StoryPoint.value(estimation.point) };
  }

  throw new Error("unknown estimation");
};

export const deserialize = function deserializeEstimation(obj: Serialized): UserEstimation.T {
  switch (obj.kind) {
    case "giveUp":
      return UserEstimation.giveUpOf();
    case "unsubmit":
      return UserEstimation.unsubmitOf();
    case "submitted":
      return UserEstimation.submittedOf(StoryPoint.create(obj.storypoint));
  }
};
