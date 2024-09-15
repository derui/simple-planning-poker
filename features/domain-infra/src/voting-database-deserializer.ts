import { DataSnapshot } from "firebase/database";
import { deserialize as deserializeEstimation, Serialized } from "./user-estimation-converter.js";
import { Estimations, Voting, StoryPoint, ApplicablePoints, User } from "@spp/shared-domain";

type VotingData = {
  revealed: boolean;
  cards: number[];
  userEstimations: Record<User.Id, Serialized> | undefined;
  theme: string | undefined;
};

const isVotingData = function isVotingData(val: unknown): val is VotingData {
  return !!val;
};

/**
 * deserialize from firebase's snapshot
 */
export const deserializeFrom = function deserializeFrom(id: Voting.Id, snapshot: DataSnapshot): Voting.T | undefined {
  const val: unknown = snapshot.val();
  if (!isVotingData(val)) {
    return;
  }

  const { revealed, cards: points, userEstimations, theme } = val;

  const applicablePoints = ApplicablePoints.create(points.map(StoryPoint.create));
  const users = Object.keys(userEstimations ?? {}).map(User.createId);
  const estimations = Estimations.create(users);

  const deserializedEstimations = Object.entries(userEstimations ?? {}).reduce((estimations, [k, estimation]) => {
    if (!estimation) {
      return estimations;
    }

    return Estimations.update(estimations, User.createId(k), deserializeEstimation(estimation));
  }, estimations);

  if (revealed) {
    return Voting.revealedOf({
      id,
      points: applicablePoints,
      estimations: deserializedEstimations,
      theme,
    });
  }

  return Voting.votingOf({
    id,
    points: applicablePoints,
    estimations: deserializedEstimations,
    theme,
  });
};
