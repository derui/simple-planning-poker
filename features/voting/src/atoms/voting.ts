import {
  Estimations,
  StoryPoint,
  User,
  UserEstimation,
  UserRepository,
  Voter,
  Voting,
  VotingRepository,
} from "@spp/shared-domain";
import { atom, useAtom, useAtomValue } from "jotai";
import { EstimationDto, RevealedEstimationDto } from "./dto.js";
import {
  ChangeThemeUseCase,
  ChangeUserModeUseCase,
  EstimatePlayerUseCase,
  ResetVotingUseCase,
  RevealUseCase,
} from "@spp/shared-use-case";
import { UseLoginUser } from "@spp/feature-login";
import { UserRole } from "../components/types.js";

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
 * Definition of hook for voting
 */
export type UseVoting = () => {
  /**
   * loading or not
   */
  loading: boolean;

  /**
   * Estimations in voting.
   */
  estimations: EstimationDto[];

  /**
   * theme of current joining voting
   */
  theme: string;

  /**
   * Reveal current voting
   */
  reveal(): void;

  /**
   * Change theme with `newTheme`
   */
  changeTheme(newTheme: string): void;

  /**
   * Change voter's role to `newRole`.
   */
  changeVoterRole(newRole: UserRole): void;

  /**
   * change estimation in voting
   */
  estimate(estimation: number): void;
};

/**
 * Definition of hook for revealed voting
 */
export type UseRevealed = () => {
  /**
   * loading or not
   */
  loading: boolean;

  /**
   * Estimations in revealed voting
   */
  estimations: RevealedEstimationDto[];

  /**
   * theme of current joining voting
   */
  theme: string;

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
  useLoginUser: UseLoginUser,
  votingRepository: VotingRepository.T,
  userRepository: UserRepository.T
): UseJoin {
  const { userId } = useLoginUser();
  const [, setVoting] = useAtom(votingAtom);
  const [status, setStatus] = useAtom(joinStatusAtom);
  const [, setUsers] = useAtom(usersAtom);
  const [, setVotingStatus] = useAtom(votingStatusAtom);

  return () => {
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
  const status = useAtomValue(votingStatusAtom);

  return () => {
    return {
      status,
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
  const { useLoginUser, changeThemeUseCase, estimatePlayerUseCase, revealUseCase, changeUserModeUseCase } =
    dependencies;
  const { userId } = useLoginUser();
  const [voting, setVoting] = useAtom(votingAtom);
  const loading = useAtomValue(votingLoadingAtom);
  const users = useAtomValue(usersAtom);

  const estimations = Array.from(voting?.participatedVoters ?? []).map<EstimationDto>((voter) => {
    const userName = users.find((v) => v.id == voter.user)?.name ?? "unknown";

    if (!voting) {
      return { name: userName, estimated: false };
    }

    const estimation = Estimations.estimationOfUser(voting.estimations, voter.user);
    const estimated = UserEstimation.isSubmitted(estimation);

    return {
      name: userName,
      estimated,
    };
  });

  return () => {
    return {
      loading,

      estimations,

      theme: voting?.theme ?? "",

      changeVoterRole(newRole) {
        if (!voting || !userId) {
          return;
        }
        const voterType = newRole == "inspector" ? Voter.VoterType.Inspector : Voter.VoterType.Normal;

        const input = {
          userId,
          votingId: voting.id,
          voterType,
        };

        changeUserModeUseCase(input)
          .then((ret) => {
            if (ret.kind == "success") {
              setVoting(ret.voting);
            }
          })
          .catch((e) => {
            console.warn(e);
          });
      },

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
  const loading = useAtomValue(votingLoadingAtom);

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

  return () => {
    return {
      loading,
      theme: voting?.theme ?? "",
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
};
