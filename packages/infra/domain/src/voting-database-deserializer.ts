import { DataSnapshot } from "firebase/database";
import { deserialize as deserializeEstimation, Serialized } from "./user-estimation-converter.js";
import { Estimations, Voting, StoryPoint, ApplicablePoints, User, Voter } from "@spp/shared-domain";

type VotingData = {
  revealed: boolean;
  points: number[];
  estimations: Record<User.Id, Serialized> | undefined;
  voters: Record<User.Id, Voter.VoterType> | undefined;
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

  const { revealed, points, estimations, voters, theme } = val;

  const applicablePoints = ApplicablePoints.create(points.map(StoryPoint.create));

  const deserializedEstimations = Object.entries(estimations ?? {}).reduce((estimations, [k, estimation]) => {
    if (!estimation) {
      return estimations;
    }

    return Estimations.update(estimations, User.createId(k), deserializeEstimation(estimation));
  }, Estimations.empty());

  const deserializedVoters = Object.entries(voters ?? {}).reduce<Voter.T[]>((accum, [k, type]) => {
    accum.push(Voter.createVoter({ user: User.createId(k), type }));
    return accum;
  }, []);

  if (revealed) {
    return Voting.revealedOf({
      id,
      points: applicablePoints,
      estimations: deserializedEstimations,
      voters: deserializedVoters,
      theme,
    });
  }

  return Voting.votingOf({
    id,
    points: applicablePoints,
    estimations: deserializedEstimations,
    voters: deserializedVoters,
    theme,
  });
};
