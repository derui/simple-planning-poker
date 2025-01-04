import { useLoginUser } from "@spp/feature-login";

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

/**
 * Create `UseJoin` with dependencies
 */
export const useJoin: UseJoin = function useJoin() {
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
