import { useLoginUser } from "@spp/feature-login";
import { UserRole } from "../components/types.js";

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
 * Create `UseVoting` hook with dependencies
 */
export const useVoting: UseVoting = function useVoting() {
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
