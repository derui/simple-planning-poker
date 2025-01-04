import { Estimations, User, UserEstimation, VoterType, Voting } from "@spp/shared-domain";
import { atom, useAtomValue } from "jotai";
import { UserRole } from "../components/types.js";
import { EstimationDto } from "./dto.js";

/**
 * current voting
 */
const votingAtom = atom<Voting.T | undefined>();

/**
 * users joined in the voting holding by `votingAtom`
 */
const usersAtom = atom<User.T[]>([]);

/**
 * atom for user role.
 */
const userRoleAtom = atom<UserRole>("player");

enum JoinStatus {
  Joining = "joining",
  Joined = "joined",
  NotJoined = "notJoined",
}
const joinStatusAtom = atom<JoinStatus>(JoinStatus.NotJoined);

export enum VotingStatus {
  Voting = "voting",
  Revealed = "revealed",
  NotJoined = "notJoined",
}
const votingStatusAtom = atom<VotingStatus>(VotingStatus.NotJoined);

/**
 * Loading atom for voting
 */
const votingLoadingAtom = atom((get) => {
  return get(votingAtom) == undefined;
});

export type UseVotingStatus = () => {
  status: VotingStatus;
};

/**
 * Create `UseVotingStatus` hook
 */
export const createUseVotingStatus = function createUseVotingStatus(): UseVotingStatus {
  return () => {
    const status = useAtomValue(votingStatusAtom);
    return {
      status,
    };
  };
};

/**
 * Create `UsePollingPlace` hook
 */
export const createUsePollingPlace = function createUsePollingPlace(): UsePollingPlace {
  return () => {
    const voting = useAtomValue(votingAtom);
    const users = useAtomValue(usersAtom);
    const loading = useAtomValue(votingLoadingAtom);
    const userRole = useAtomValue(userRoleAtom);

    const voters = (voting?.participatedVoters ?? []).filter((v) => VoterType.Normal == v.type);
    const inspectors = (voting?.participatedVoters ?? []).filter((v) => VoterType.Inspector == v.type);
    const estimations = Array.from(voters).map<EstimationDto>((voter) => {
      const userName = users.find((v) => v.id == voter.user)?.name ?? "unknown";

      if (!voting) {
        return { name: userName };
      }

      const estimation = Estimations.estimationOfUser(voting.estimations, voter.user);
      let estimated: string | undefined;
      if (UserEstimation.isSubmitted(estimation)) {
        estimated = estimation.point.toString();
      }

      return {
        name: userName,
        estimated,
      };
    });

    const _inspectors = inspectors.map<EstimationDto>((voter) => {
      const userName = users.find((v) => v.id == voter.user)?.name ?? "unknown";

      return { name: userName };
    });

    return {
      id: voting?.id,
      loading,

      estimations,

      theme: voting?.theme ?? "",

      userRole,

      inspectors: _inspectors,

      points: voting?.points.map((v) => String(v)) ?? [],
    };
  };
};
