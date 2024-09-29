import { StoryPoint, User, UserEstimation, UserRepository, Voting, VotingRepository } from "@spp/shared-domain";
import { atom, useAtom, useAtomValue } from "jotai";
import { EstimationDto, RevealedEstimationDto } from "./dto.js";
import { UseAuth } from "@spp/feature-login";
import { ChangeThemeUseCase, EstimatePlayerUseCase, ResetVotingUseCase, RevealUseCase } from "@spp/shared-use-case";

/**
 * current voting
 */
const votingAtom = atom<Voting.T | undefined>();

/**
 * users joined in the voting holding by `votingAtom`
 */
const usersAtom = atom<User.T[]>([]);

enum JoinStatus {
  Joining = "joining",
  Joined = "joined",
  NotJoined = "notJoined",
}
const joinStatusAtom = atom<JoinStatus>(JoinStatus.NotJoined);

enum VotingStatus {
  Voting = "voting",
  Revealed = "revealed",
  NotJoined = "notJoined",
}
const votingStatusAtom = atom<VotingStatus>(VotingStatus.NotJoined);

/**
 * Loading atom for voting
 */
const votingLoadingAtom = atom((get) => {
  return get(votingAtom) != undefined;
});

/**
 * Definition of hook for join
 */
export type UseJoin = {
  status: JoinStatus;

  /**
   * Join login user into the voting
   */
  join(id: Voting.Id): void;
};

export type UseVotingStatus = {
  status: VotingStatus;
};

/**
 * Definition of hook for voting
 */
export type UseVoting = {
  /**
   * loading or not
   */
  loading: boolean;
  /**
   * Estimations in voting.
   */
  estimations: EstimationDto[];

  /**
   * Reveal current voting
   */
  reveal(): void;

  /**
   * Change theme with `newTheme`
   */
  changeTheme(newTheme: string): void;

  /**
   * change estimation in voting
   */
  estimate(estimation: number): void;
};

/**
 * Definition of hook for revealed voting
 */
export type UseRevealed = {
  /**
   * Estimations in revealed voting
   */
  estimations: RevealedEstimationDto[];

  /**
   * Change theme with `newTheme`
   */
  changeTheme(newTheme: string): void;

  /**
   * Reset revealed voting
   */
  reset(): void;
};

/**
 * Create `UseJoin` with dependencies
 */
export const createUseJoin = function createUseJoin(
  useAuth: UseAuth,
  votingRepository: VotingRepository.T,
  userRepository: UserRepository.T
): UseJoin {
  const { currentUserId } = useAuth();
  const [, setVoting] = useAtom(votingAtom);
  const [status, setStatus] = useAtom(joinStatusAtom);
  const [, setUsers] = useAtom(usersAtom);
  const [, setVotingStatus] = useAtom(votingStatusAtom);

  return {
    status,

    join(votingId) {
      if (!currentUserId) {
        return;
      }

      setStatus(JoinStatus.Joining);

      votingRepository
        .findBy(votingId)
        .then((voting) => {
          setStatus(JoinStatus.Joined);

          if (voting) {
            userRepository
              .listIn(Array.from(voting.estimations.userEstimations.keys()))
              .then((users) => {
                setUsers(users);
              })
              .catch((e) => console.warn(e));
            setVoting(voting);

            if (voting.status == Voting.VotingStatus.Revealed) {
              setVotingStatus(VotingStatus.Revealed);
            } else {
              setVotingStatus(VotingStatus.Voting);
            }
          }
        })
        .catch(() => {
          setStatus(JoinStatus.NotJoined);
          setVoting(undefined);
        });
    },
  };
};

/**
 * Create `UseVotingStatus` hook
 */
export const createUseVotingStatus = function createUseVotingStatus(): UseVotingStatus {
  const status = useAtomValue(votingStatusAtom);
  return {
    status,
  };
};

/**
 * Create `UseVoting` hook with dependencies
 */
export const createUseVoting = function createUseVoting(dependencies: {
  useAuth: UseAuth;
  changeThemeUseCase: ChangeThemeUseCase;
  estimatePlayerUseCase: EstimatePlayerUseCase;
  revealUseCase: RevealUseCase;
}): UseVoting {
  const { useAuth, changeThemeUseCase, estimatePlayerUseCase, revealUseCase } = dependencies;
  const { currentUserId } = useAuth();
  const [voting, setVoting] = useAtom(votingAtom);
  const loading = useAtomValue(votingLoadingAtom);
  const users = useAtomValue(usersAtom);

  const estimations = Array.from(voting?.estimations?.userEstimations?.entries() ?? []).map<EstimationDto>(
    ([user, estimation]) => {
      const estimated = UserEstimation.isSubmitted(estimation);
      const userName = users.find((v) => v.id == user)?.name ?? "unknown";

      return {
        name: userName,
        estimated,
      };
    }
  );

  return {
    loading,

    estimations,

    changeTheme(newTheme) {
      if (!voting) {
        return;
      }

      changeThemeUseCase({
        theme: newTheme,
        votingId: voting.id,
      })
        .then((ret) => {
          if (ret.kind == "success") {
            setVoting(ret.voting);
          }
        })
        .catch((e) => {
          console.warn(e);
        });
    },

    estimate(estimation: number) {
      if (!voting || !currentUserId) {
        return;
      }

      estimatePlayerUseCase({
        userId: currentUserId,
        votingId: voting.id,
        userEstimation: UserEstimation.submittedOf(StoryPoint.create(estimation)),
      })
        .then((result) => {
          switch (result.kind) {
            case "success":
              setVoting(result.voting);
              break;
          }
        })
        .catch((e) => {
          console.warn(e);
        });
    },
    reveal() {
      if (!voting) {
        return;
      }

      revealUseCase({ votingId: voting.id })
        .then((result) => {
          switch (result.kind) {
            case "success":
              setVoting(result.voting);
              break;
          }
        })
        .catch((e) => {
          console.warn(e);
        });
    },
  };
};

/**
 * Create `UseRevealed` hook
 */
export const createUseRevealed = function createUseReRevealed(dependencies: {
  changeThemeUseCase: ChangeThemeUseCase;
  resetVotingUseCase: ResetVotingUseCase;
}): UseRevealed {
  const { changeThemeUseCase, resetVotingUseCase } = dependencies;
  const [voting, setVoting] = useAtom(votingAtom);
  const users = useAtomValue(usersAtom);

  const estimations = Array.from(voting?.estimations?.userEstimations?.entries() ?? []).map<RevealedEstimationDto>(
    ([user, estimation]) => {
      const estimated = UserEstimation.estimatedPoint(estimation);
      const userName = users.find((v) => v.id == user)?.name ?? "unknown";

      return {
        name: userName,
        estimated: estimated ? StoryPoint.value(estimated).toString() : "?",
      };
    }
  );

  return {
    estimations,

    changeTheme(newTheme) {
      if (!voting) {
        return;
      }

      changeThemeUseCase({
        theme: newTheme,
        votingId: voting.id,
      })
        .then((ret) => {
          if (ret.kind == "success") {
            setVoting(ret.voting);
          }
        })
        .catch((e) => {
          console.warn(e);
        });
    },

    reset() {
      if (!voting) {
        return;
      }

      resetVotingUseCase({ votingId: voting.id })
        .then((result) => {
          switch (result.kind) {
            case "success":
              setVoting(result.voting);
              break;
          }
        })
        .catch((e) => {
          console.warn(e);
        });
    },
  };
};
