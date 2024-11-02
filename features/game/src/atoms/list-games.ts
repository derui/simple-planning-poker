import { UseLoginUser } from "@spp/feature-login";
import { Game, GameRepository } from "@spp/shared-domain";
import { StartVotingUseCase, StartVotingUseCaseInput } from "@spp/shared-use-case";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, voteStartingStatusAtom } from "./game-atom.js";
import { VoteStartingStatus } from "./type.js";

/**
 * Hook definition to list game
 */
export type UseListGames = () => {
  /**
   * Status of starting voting.
   */
  voteStartingStatus?: VoteStartingStatus;

  /**
   * Current joined/owned games
   */
  games: GameDto[];

  /**
   * Start voting from a game.
   */
  startVoting: (gameId: string) => void;
};

/**
 * Create hook implementation of `UseListGame`
 */
export const createUseListGames = function createUseListGames({
  gameRepository,
  useLoginUser,
  startVotingUseCase,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
  startVotingUseCase: StartVotingUseCase;
}): UseListGames {
  return () => {
    const [games, setGames] = useAtom(gamesAtom);
    const { userId } = useLoginUser();
    const [voteStartingStatus, setVoteStartingStatus] = useAtom(voteStartingStatusAtom);

    useEffect(() => {
      if (userId) {
        gameRepository
          .listUserCreated(userId)
          .then((games) => {
            setGames(games);
          })
          .catch(() => {
            setGames([]);
          });
      }
    }, [userId]);

    return {
      voteStartingStatus,

      games: !userId ? [] : games.map((v) => toGameDto(v, userId)),

      startVoting: (gameId: string): void => {
        const domainGameId = Game.createId(gameId);

        const input: StartVotingUseCaseInput = { gameId: domainGameId };

        setVoteStartingStatus(VoteStartingStatus.Starting);

        startVotingUseCase(input)
          .then((input) => {
            switch (input.kind) {
              case "success":
                setVoteStartingStatus(VoteStartingStatus.Started);
                break;
              case "failed":
              case "notFound":
                setVoteStartingStatus(undefined);
                console.warn("Can not start voting");
                break;
            }
          })
          .catch(() => {
            setVoteStartingStatus(undefined);
          })
          .finally(() => {});
      },
    };
  };
};
