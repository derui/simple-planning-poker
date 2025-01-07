import { Estimations, StoryPoint, User, UserEstimation, Voter, VoterType, Voting } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/mock/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { dispatch } from "@spp/shared-use-case";
import { Atom, atom, WritableAtom } from "jotai";
import { atomWithRefresh, loadable, unwrap } from "jotai/utils";
import { Loadable } from "jotai/vanilla/utils/loadable";
import { EstimationDto } from "./dto.js";
import { JoinedVotingStatus, PollingPlace } from "./type.js";

const currentUserIdAtom = atom<User.Id | undefined>();

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

const internalJoiningAtom = atom(false);

/**
 * loading atom for joining
 */
export const joiningAtom: Atom<boolean> = atom((get) => get(internalJoiningAtom));

/**
 * Join user to the voting
 */
export const joinVotingAtom: WritableAtom<null, [userId: User.Id, votingId: Voting.Id], void> = atom(
  null,
  (_get, set, userId: User.Id, votingId: Voting.Id) => {
    set(internalJoiningAtom, true);

    VotingRepository.findBy({ id: votingId })
      .then(async (voting) => {
        if (!voting) {
          throw new Error("not found");
        }

        if (!voting.participatedVoters.some((v) => v.user === userId)) {
          const [newVoting, event] = Voting.joinUser(voting, userId);
          await VotingRepository.save({ voting: newVoting });

          if (event) {
            dispatch(event);
          }
        }

        set(currentVotingIdAtom, votingId);
        set(currentUserIdAtom, userId);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        set(internalJoiningAtom, false);
      });
  }
);

/**
 * users joined in the voting holding by `currentVotingAtom`
 */
const asyncUsersAtom = atom(async (get) => {
  const voting = await get(asyncCurrentVotingAtom);
  if (!voting) {
    return [];
  }

  return await UserRepository.listIn({ users: voting.participatedVoters.map((v) => v.user) });
});

/**
 *  voters joined in the voting holding by `currentVotingAtom`
 */
const asyncVotersAtom = atom(async (get) => {
  const voting = await get(asyncCurrentVotingAtom);
  if (!voting) {
    return [];
  }

  return voting.participatedVoters.filter((v) => VoterType.Normal == v.type);
});

/**
 * inspectors joined in the voting holding by `currentVotingAtom`
 */
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

  const currentUserId = get(currentUserIdAtom);

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
      loginUser: currentUserId === voter.user,
    };
  });

  const _inspectors = inspectors.map<EstimationDto>((voter) => {
    const userName = users.find((v) => v.id == voter.user)?.name ?? "unknown";

    return { name: userName, loginUser: currentUserId === voter.user };
  });

  return {
    id: voting?.id,

    estimations,

    theme: voting?.theme ?? "",

    inspectors: _inspectors,

    points: voting.points.map((v) => String(v)),
  } satisfies PollingPlace;
});

/**
 * Get current polling place entity
 */
export const pollingPlaceAtom: Atom<Loadable<Promise<PollingPlace | undefined>>> = loadable(asyncPollingPlaceAtom);

/**
 * get current voting is revealable or not
 */
export const revealableAtom: Atom<boolean> = atom((get) => {
  const voting = get(unwrap(asyncCurrentVotingAtom));
  if (!voting) {
    return false;
  }

  return Voting.canReveal(voting);
});

/**
 * get current user's joined voting status
 */
export const joinedVotingStatusAtom: Atom<JoinedVotingStatus> = atom((get) => {
  const voting = get(unwrap(asyncCurrentVotingAtom));
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
 * Toggle the current user's role.
 */
export const toggleRoleAtom: WritableAtom<null, [], void> = atom(null, (get, set) => {
  const voting = get(unwrap(asyncCurrentVotingAtom));

  if (!voting) {
    return;
  }

  const currentUserId = get(currentUserIdAtom);
  const voter = voting.participatedVoters.find((v) => v.user == currentUserId);

  if (!voter) {
    return;
  }

  const newVoter = Voter.changeVoterType(
    voter,
    voter.type == VoterType.Normal ? VoterType.Inspector : VoterType.Normal
  );
  const [newVoting, event] = Voting.updateVoter(voting, newVoter);

  VotingRepository.save({ voting: newVoting })
    .then(async () => {
      dispatch(event);
    })
    .then(() => {
      set(asyncCurrentVotingAtom);
    })
    .catch((e) => {
      console.error(e);
    });
});

/**
 * Change theme of current voting
 */
export const changeThemeAtom: WritableAtom<null, [theme: string], void> = atom(null, (get, set, theme: string) => {
  const voting = get(unwrap(asyncCurrentVotingAtom));

  if (!voting) {
    return;
  }

  const newVoting = Voting.changeTheme(voting, theme);

  VotingRepository.save({ voting: newVoting })
    .then(() => {
      set(asyncCurrentVotingAtom);
    })
    .catch((e) => {
      console.error(e);
    });
});

/**
 * Estimate current voting
 */
export const estimateAtom: WritableAtom<null, [estimation: StoryPoint.T], void> = atom(
  null,
  (get, set, estimation: StoryPoint.T) => {
    const voting = get(unwrap(asyncCurrentVotingAtom));
    const currentUserId = get(currentUserIdAtom);
    if (!voting || !currentUserId) {
      return;
    }

    try {
      const newVoting = Voting.takePlayerEstimation(voting, currentUserId, UserEstimation.submittedOf(estimation));

      VotingRepository.save({ voting: newVoting })
        .then(() => {
          set(asyncCurrentVotingAtom);
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (e) {
      console.error(e);
    }
  }
);

/**
 * Reveal voting if it able today
 */
export const revealAtom: WritableAtom<null, [], void> = atom(null, (get, set) => {
  const voting = get(unwrap(asyncCurrentVotingAtom));

  if (!voting || !Voting.canReveal(voting)) {
    return;
  }

  const [newVoting, event] = Voting.reveal(voting);

  VotingRepository.save({ voting: newVoting })
    .then(() => {
      dispatch(event);
    })
    .then(() => {
      set(asyncCurrentVotingAtom);
    })
    .catch((e) => {
      console.error(e);
    });
});
