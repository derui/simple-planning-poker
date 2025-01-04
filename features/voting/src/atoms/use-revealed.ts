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
 * Create `UseRevealed` hook
 */
export const useRevealed: UseRevealed = function useRevealed() {
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
