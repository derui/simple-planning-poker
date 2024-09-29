import { StoryPoint, User, UserEstimation, UserRepository, Voting, VotingRepository } from "@spp/shared-domain";
import { atom } from "jotai";
import { EstimationDto, RevealedEstimationDto } from "./dto.js";
import { UseAuth } from "@spp/feature-login";
import { useAtom } from "jotai/ts3.8/esm/react";
import { ChangeThemeUseCase, EstimatePlayerUseCase, RevealUseCase } from "@spp/shared-use-case";

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
  const [loading] = useAtom(votingLoadingAtom);
  const [users] = useAtom(usersAtom);

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
      }).catch((e) => {
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
