import { UseLoginUser } from "@spp/feature-login";
import { GameRepository, User } from "@spp/shared-domain";
import { EventDispatcher, newCreateGameUseCase } from "@spp/shared-use-case";
import { useAtom } from "jotai";
import { CreateGameError, createGameErrorsAtom, createGameStatusAtom, gamesAtom } from "./game-atom.js";
import { CreateGameStatus } from "./type.js";

// Hook definitions

/**
 * Hook definition to create game
 */
export type UseCreateGame = () => {
  status?: CreateGameStatus;

  /**
   * errors while creating game
   */
  errors: CreateGameError[];

  /**
   * Create game with inputs. If this method failed, update status.
   *
   * @param callback Callback after a game is created
   */
  create: (name: string, points: string, callback?: (gameId: string) => void) => void;
};

// hook implementations
export const createUseCreateGame = function createUseCreateGame(dependencies: {
  gameRepository: GameRepository.T;
  dispatcher: EventDispatcher;
  useLoginUser: UseLoginUser;
}): UseCreateGame {
  const { gameRepository, dispatcher, useLoginUser } = dependencies;

  return () => {
    const [status, setStatus] = useAtom(createGameStatusAtom);
    const { userId } = useLoginUser();
    const [, setGames] = useAtom(gamesAtom);
    const [errors, setErrors] = useAtom(createGameErrorsAtom);

    return {
      status,
      errors,

      create: (name, points, callback) => {
        if (errors.length > 0 || !userId) {
          return;
        }
        setErrors([]);
        setStatus(CreateGameStatus.Waiting);

        const _do = async function _do(userId: User.Id) {
          const ret = await newCreateGameUseCase(
            dispatcher,
            gameRepository
          )({
            createdBy: userId,
            name,
            points: points
              .split(",")
              .filter((v) => v.trim() !== "")
              .map((v) => Number(v)),
          });
          console.log(ret);

          switch (ret.kind) {
            case "success":
              setStatus(CreateGameStatus.Completed);
              callback?.(ret.game.id);
              break;
            case "conflictName":
              setErrors(["NameConflicted"]);
              setStatus(CreateGameStatus.Failed);
              return;
            case "invalidName":
              setErrors(["InvalidName"]);
              setStatus(CreateGameStatus.Failed);
              return;
            case "invalidStoryPoints":
              setErrors(["InvalidPoints"]);
              setStatus(CreateGameStatus.Failed);
              return;
            case "failed":
              setStatus(CreateGameStatus.Failed);
              return;
          }

          const games = await gameRepository.listUserCreated(userId);
          setGames(games);
        };

        _do(userId).catch(() => {
          setStatus(CreateGameStatus.Failed);
        });
      },
    };
  };
};
