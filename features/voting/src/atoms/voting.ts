import { UseLoginUser } from "@spp/feature-login";
import {
  Estimations,
  StoryPoint,
  User,
  UserEstimation,
  UserRepository,
  VoterType,
  Voting,
  VotingRepository,
} from "@spp/shared-domain";
import {
  ChangeThemeUseCase,
  ChangeUserModeUseCase,
  EstimatePlayerUseCase,
  ResetVotingUseCase,
  RevealUseCase,
} from "@spp/shared-use-case";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
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

/**
 * Definition of hook for join
 */
export type UseJoin = () => {
  status: JoinStatus;

  /**
   * Join login user into the voting
   */
  join(id: Voting.Id): void;
};

export type UseVotingStatus = () => {
  status: VotingStatus;
};

/**
 * Hook to get common attributes at polling place
 */
export type UsePollingPlace = () => {
  /**
   * ID of current voting
   */
  id?: string;

  /**
   * loading or not
   */
  loading: boolean;

  /**
   * Estimations in voting.
   */
  estimations: EstimationDto[];

  /**
   * inspectors in voting
   */
  inspectors: EstimationDto[];

  /**
   * theme of current joining voting
   */
  theme: string;

  /**
   * role of login user.
   */
  userRole: UserRole;

  /**
   * applicable points in this voting
   */
  points: string[];
};

/**
 * Definition of hook for voting
 */
export type UseVoting = () => {
  /**
   * Revealable or not current voting
   */
  revealable: boolean;

  /**
   * Login user estimated
   */
  estimated?: number;

  /**
   * Reveal current voting
   */
  reveal: () => void;

  /**
   * Change theme with `newTheme`
   */
  changeTheme: (newTheme: string) => void;

  /**
   * Change voter's role to `newRole`.
   */
  changeVoterRole: (newRole: UserRole) => void;

  /**
   * change estimation in voting
   */
  estimate: (estimation: number) => void;
};

/**
 * Definition of hook for revealed voting
 */
export type UseRevealed = () => {
  /**
   * Change theme with `newTheme`
   */
  changeTheme: (newTheme: string) => void;

  /**
   * Reset revealed voting
   */
  reset: () => void;
};

/**
 * Create `UseJoin` with dependencies
 */
export const createUseJoin = function createUseJoin(
  useLoginUser: UseLoginUser,
  votingRepository: VotingRepository.T,
  userRepository: UserRepository.T
): UseJoin {
  return () => {
    const { userId } = useLoginUser();
    const [, setVoting] = useAtom(votingAtom);
    const [status, setStatus] = useAtom(joinStatusAtom);
    const [, setUsers] = useAtom(usersAtom);
    const [, setVotingStatus] = useAtom(votingStatusAtom);
    const setUserRole = useSetAtom(userRoleAtom);

    return {
      status,

      join(votingId) {
        if (!userId) {
          return;
        }

        setStatus(JoinStatus.Joining);

        votingRepository
          .findBy(votingId)
          .then(async (voting) => {
            if (voting) {
              setStatus(JoinStatus.Joined);

              const users = await userRepository.listIn(voting.participatedVoters.map((v) => v.user));
              setUsers(users);
              setVoting(voting);
              setUserRole("player");

              if (voting.status == Voting.VotingStatus.Revealed) {
                setVotingStatus(VotingStatus.Revealed);
              } else {
                setVotingStatus(VotingStatus.Voting);
              }
            } else {
              setStatus(JoinStatus.NotJoined);
              setVoting(undefined);
            }
          })
          .catch(() => {
            setStatus(JoinStatus.NotJoined);
            setVoting(undefined);
          });
      },
    };
  };
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

/**
 * Create `UseVoting` hook with dependencies
 */
export const createUseVoting = function createUseVoting(dependencies: {
  useLoginUser: UseLoginUser;
  changeThemeUseCase: ChangeThemeUseCase;
  estimatePlayerUseCase: EstimatePlayerUseCase;
  changeUserModeUseCase: ChangeUserModeUseCase;
  revealUseCase: RevealUseCase;
}): UseVoting {
  return () => {
    const { useLoginUser, changeThemeUseCase, estimatePlayerUseCase, revealUseCase, changeUserModeUseCase } =
      dependencies;
    const { userId } = useLoginUser();
    const [voting, setVoting] = useAtom(votingAtom);
    const [, setUserRole] = useAtom(userRoleAtom);

    let estimated = undefined;
    if (voting && userId) {
      const estimation = Estimations.estimationOfUser(voting.estimations, userId);
      if (UserEstimation.isSubmitted(estimation)) {
        estimated = estimation.point;
      }
    }
    const revealable = voting ? Voting.canReveal(voting) : false;
    const setVotingStatus = useSetAtom(votingStatusAtom);

    return {
      revealable,
      estimated,

      changeVoterRole: (newRole) => {
        if (!voting || !userId) {
          return;
        }
        const voterType = newRole == "inspector" ? VoterType.Inspector : VoterType.Normal;

        const input = {
          userId,
          votingId: voting.id,
          voterType,
        };

        changeUserModeUseCase(input)
          .then((ret) => {
            if (ret.kind == "success") {
              setVoting(ret.voting);
              setUserRole(newRole);
            }
          })
          .catch((e) => {
            console.warn(e);
          });
      },

      changeTheme: (newTheme) => {
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

      estimate: (estimation: number) => {
        if (!voting || !userId) {
          return;
        }

        estimatePlayerUseCase({
          userId: userId,
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
      reveal: () => {
        if (!voting) {
          return;
        }

        revealUseCase({ votingId: voting.id })
          .then((result) => {
            switch (result.kind) {
              case "success":
                setVoting(result.voting);
                setVotingStatus(VotingStatus.Revealed);
                break;
            }
          })
          .catch((e) => {
            console.warn(e);
          });
      },
    };
  };
};

/**
 * Create `UseRevealed` hook
 */
export const createUseRevealed = function createUseReRevealed(dependencies: {
  changeThemeUseCase: ChangeThemeUseCase;
  resetVotingUseCase: ResetVotingUseCase;
}): UseRevealed {
  return () => {
    const { changeThemeUseCase, resetVotingUseCase } = dependencies;
    const [voting, setVoting] = useAtom(votingAtom);

    return {
      changeTheme: (newTheme) => {
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

      reset: () => {
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
};
