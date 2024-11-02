import { UseLoginUser } from "@spp/feature-login";
import { Game } from "@spp/shared-domain";
import { EventDispatcher, StartVotingUseCase, StartVotingUseCaseInput } from "@spp/shared-use-case";
import { atom, useAtom, useAtomValue } from "jotai";
import { GameDto, toGameDto } from "./dto.js";
import { VoteStartingStatus } from "./type.js";

/**
 * games that are owned by or joined by an user
 */
const gamesAtom = atom<Game.T[]>([]);

const voteStartingStatusAtom = atom<VoteStartingStatus | undefined>();

/**
 * Hook definition to list game
 */
export type UseListGame = () => {
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
  useLoginUser,
  startVotingUseCase,
  dispatcher,
}: {
  useLoginUser: UseLoginUser;
  startVotingUseCase: StartVotingUseCase;
  dispatcher: EventDispatcher;
}): UseListGame {
  return () => {
    const games = useAtomValue(gamesAtom);
    const { userId } = useLoginUser();
    const [voteStartingStatus, setVoteStartingStatus] = useAtom(voteStartingStatusAtom);

    return {
      voteStartingStatus,

      games: !userId ? [] : games.map((v) => toGameDto(v, userId)),

      startVoting: (gameId: string) => {
        const domainGameId = Game.createId(gameId);

        const input: StartVotingUseCaseInput = { gameId: domainGameId };

        startVotingUseCase(input).then((input) => {
          switch (input.kind) {
            case "success":
              break;
            case "failed":
            case "notFound":
              console.warn("Can not start voting");
              break;
          }
        });
      },
    };
  };
};
