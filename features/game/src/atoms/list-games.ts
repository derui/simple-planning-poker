import { UseLoginUser } from "@spp/feature-login";
import { Game, GameRepository, User, UserRepository } from "@spp/shared-domain";
import { StartVotingUseCase, StartVotingUseCaseInput } from "@spp/shared-use-case";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { GameDto, toGameDto, toUserDto, UserDto } from "./dto.js";
import { gamesAtom, selectedGameAtom, voteStartingStatusAtom } from "./game-atom.js";
import { VoteStartingStatus } from "./type.js";

const loadingAtom = atom<"completed" | "loading">("completed");
const loginUserAtom = atom<User.T | undefined>(undefined);

/**
 * Hook definition to list game
 */
export type UseListGames = () => {
  loading: "completed" | "loading";

  /**
   * Status of starting voting.
   */
  voteStartingStatus?: VoteStartingStatus;

  /**
   * Current logged in user
   */
  loginUser?: UserDto;

  /**
   * Current joined/owned games
   */
  games: GameDto[];

  /**
   * Selected game
   */
  selectedGame?: GameDto;

  /**
   * Select game.
   *
   * @param gameId Id of the game to select.
   */
  select: (gameId: string) => void;

  /**
   * Start voting from a game.
   *
   * @param gameId Id of the game to start voting from.
   * @param callback Callback to be called when the voting is started.
   */
  startVoting: (gameId: string, callback?: (votingId: string) => void) => void;
};

/**
 * Create hook implementation of `UseListGame`
 */
export const createUseListGames = function createUseListGames({
  gameRepository,
  useLoginUser,
  userRepository,
  startVotingUseCase,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
  startVotingUseCase: StartVotingUseCase;
  userRepository: UserRepository.T;
}): UseListGames {
  return () => {
    const [loading, setLoading] = useAtom(loadingAtom);
    const [games, setGames] = useAtom(gamesAtom);
    const [selectedGame, setSelectedGame] = useAtom(selectedGameAtom);
    const [loginUser, setLoginUser] = useAtom(loginUserAtom);
    const { userId } = useLoginUser();
    const [voteStartingStatus, setVoteStartingStatus] = useAtom(voteStartingStatusAtom);

    useEffect(() => {
      setLoading("loading");
      if (userId) {
        const fetchGame = gameRepository
          .listUserCreated(userId)
          .then((games) => {
            setGames(games);
          })
          .catch(() => {
            setGames([]);
          });

        // fetch user from userRepository
        const fetchUser = userRepository.findBy(userId).then((user) => {
          setLoginUser(user);
        });

        Promise.all([fetchGame, fetchUser]).finally(() => {
          setTimeout(() => setLoading("completed"), 150);
        });
      }
    }, [userId, setGames, setLoading]);

    return {
      loading,
      voteStartingStatus,
      loginUser: loginUser ? toUserDto(loginUser) : undefined,
      selectedGame: selectedGame ? toGameDto(selectedGame) : undefined,

      games: !userId ? [] : games.map((v) => toGameDto(v)),

      select: (gameId: string): void => {
        setSelectedGame(games.find((v) => v.id === gameId));
      },

      startVoting: (gameId: string, callback): void => {
        const domainGameId = Game.createId(gameId);

        const input: StartVotingUseCaseInput = { gameId: domainGameId };

        setVoteStartingStatus(VoteStartingStatus.Starting);

        startVotingUseCase(input)
          .then((input) => {
            switch (input.kind) {
              case "success":
                setVoteStartingStatus(VoteStartingStatus.Started);
                callback?.(input.voting.id);
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
