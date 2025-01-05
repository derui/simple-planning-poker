import { Estimations, User, UserEstimation, VoterType, Voting } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/mock/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { Atom, atom } from "jotai";
import { atomWithRefresh, loadable, unwrap } from "jotai/utils";
import { UserRole } from "../components/types.js";
import { EstimationDto } from "./dto.js";
import { JoinedVotingStatus, PollingPlace } from "./type.js";

const currentUserIdAtom = atom<User.Id | undefined>();

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

/**
 * Atom for current voting id
 */
const currentVotingIdAtom = atom<Voting.Id | undefined>();

/**
 * Atom for current voting domain
 */
const asyncCurrentVotingAtom = atomWithRefresh(async (get) => {
  const id = get(currentVotingIdAtom);
  if (id == undefined) {
    return undefined;
  }

  const voting = await VotingRepository.findBy({ id });
  return voting;
});

/**
 * users joined in the voting holding by `votingAtom`
 */
const asyncUsersAtom = atom(async (get) => {
  const voting = await get(asyncCurrentVotingAtom);
  if (!voting) {
    return [];
  }

  return await UserRepository.listIn({ users: voting.participatedVoters.map((v) => v.user) });
});

const asyncVotersAtom = atom(async (get) => {
  const voting = await get(asyncCurrentVotingAtom);
  if (!voting) {
    return [];
  }

  return voting.participatedVoters.filter((v) => VoterType.Normal == v.type);
});

const asyncInspectorsAtom = atom(async (get) => {
  const voting = await get(asyncCurrentVotingAtom);
  if (!voting) {
    return [];
  }

  return voting.participatedVoters.filter((v) => VoterType.Normal == v.type);
});

/**
 * Create polling place for voting hook
 */
const asyncPollingPlaceAtom = atom<Promise<PollingPlace | undefined>>(async (get) => {
  const voting = await get(asyncCurrentVotingAtom);
  if (!voting) {
    return undefined;
  }

  const users = await get(asyncUsersAtom);
  const voters = await get(asyncVotersAtom);
  const inspectors = await get(asyncInspectorsAtom);

  const estimations = Array.from(voters).map<EstimationDto>((voter) => {
    const userName = users.find((v) => v.id == voter.user)?.name ?? "unknown";

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

    estimations,

    theme: voting?.theme ?? "",

    inspectors: _inspectors,

    points: voting.points.map((v) => String(v)),
  } satisfies PollingPlace;
});

export const pollingPlaceAtom = loadable(asyncPollingPlaceAtom);

/**
 * get current user's joined voting status
 */
const internalJoinedVotingStatusAtom = atom(async (get) => {
  const voting = await get(asyncCurrentVotingAtom);
  if (!voting) {
    return JoinedVotingStatus.NotJoined;
  }

  const currentUserId = get(currentUserIdAtom);
  if (!voting.participatedVoters.some((v) => v.user == currentUserId)) {
    return JoinedVotingStatus.NotJoined;
  }

  if (voting.status == Voting.VotingStatus.Revealed) {
    return JoinedVotingStatus.Revealed;
  }
  return JoinedVotingStatus.Voting;
});

/**
 * The current joined voting status.
 */
export const joinedVotingStatusAtom: Atom<JoinedVotingStatus | undefined> = unwrap(internalJoinedVotingStatusAtom);
