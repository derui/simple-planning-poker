import { UseLoginUser } from "@spp/feature-login";
import { Game, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { EventDispatcher, newCreateGameUseCase } from "@spp/shared-use-case";
import { useAtom } from "jotai";
import { createGameStatusAtom, CreateGameValidation, createGameValidationsAtom, gamesAtom } from "./game-atom.js";
import { CreateGameStatus } from "./type.js";

// Hook definitions

/**
 * Hook definition to create game
 */
export type UseCreateGame = () => {
  status?: CreateGameStatus;

  /**
   * Errors varidation or creation
   */
  errors: CreateGameValidation[];

  /**
   * Return creatable or not with inputs.
   *
   * @param name current input for name
   * @param points current input for points
   */
  validate: (name: string, points: string) => void;

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
    const [errors, setErrors] = useAtom(createGameValidationsAtom);

    return {
      status,
      errors,

      validate: (name, points) => {
        const errors: CreateGameValidation[] = [];
        if (!Game.canChangeName(name)) {
          errors.push("InvalidName");
        }

        const normalizedPoints = points
          .split(",")
          .filter((v) => !!v.trim())
          .map((v) => Number(v));

        if (normalizedPoints.length == 0) {
          errors.push("InvalidPoints");
        }

        if (!normalizedPoints.every(StoryPoint.isValid)) {
          errors.push("InvalidPoints");
        }

        setErrors(errors);
      },

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
            points: points.split(",").map((v) => Number(v)),
          });

          switch (ret.kind) {
            case "success":
              setStatus(CreateGameStatus.Completed);
              callback?.(ret.game.id);
              break;
            case "conflictName":
              setStatus(CreateGameStatus.Failed);
              setErrors(["NameConflicted"]);
              return;
            case "invalidStoryPoint":
            case "invalidStoryPoints":
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
