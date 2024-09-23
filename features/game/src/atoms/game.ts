import { Game, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { EventDispatcher, newCreateGameUseCase } from "@spp/shared-use-case";
import { atom, useAtom } from "jotai";
import { GameDto } from "./dto.js";

/**
 * Current user id in this feature.
 */
const currentUserIdAtom = atom<User.Id | undefined>();

/**
 * games that are owned by or joined by an user
 */
const gamesAtom = atom<Game.T[]>([]);

/**
 * A validation errors
 */
export type CreateGameValidation = "InvalidName" | "InvalidPoints" | "NameConflicted";

/**
 * An atom to store validation
 */
const createGameValidationsAtom = atom<CreateGameValidation[]>([]);

export enum PrepareGameStatus {
  /**
   * NotPrepared state is not prepared yet
   */
  NotPrepared = "notPrepared",

  /**
   * Preparing state is preparing to create
   */
  Preparing = "preparing",

  /**
   * Prepared state is preparing finished
   */
  Prepared = "prepared",
}
const prepareGameStatusAtom = atom<PrepareGameStatus>(PrepareGameStatus.NotPrepared);

/**
 * Status enum of game creating
 */
export enum CreateGameStatus {
  /**
   * Completed state is completed to create a game
   */
  Completed = "completed",

  /**
   * Failed state is failed to create a game
   */
  Failed = "failed",

  /**
   * Waiting state is waiting to finish creating a game
   */
  Waiting = "waiting",
}

const createGameStatusAtom = atom<CreateGameStatus | undefined>(CreateGameStatus.Waiting);

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
  validate(name: string, points: string): void;

  /**
   * Create game with inputs. If this method failed, update status.
   */
  create(name: string, points: string): Promise<void>;
};

/**
 * Preparation logic for feature enablement.
 */
export type UsePrepareGame = () => {
  /**
   * Status of preparation
   */
  status: PrepareGameStatus;

  /**
   * Execute preparation for this feature.
   *
   * MUST CALL THIS FIRST BEFORE USE ANY FUNCTION IN THIS FEATURE!!.
   */
  prepare(userId: User.Id): void;
};

/**
 * Hook definition to list game
 */
export type UseListGame = () => {
  /**
   * Current joined/owned games
   */
  games: GameDto[];
};

// hook implementations
export const createUseCreateGame = function createUseCreateGame(
  gameRepository: GameRepository.T,
  dispatcher: EventDispatcher
): UseCreateGame {
  return () => {
    const [status, setStatus] = useAtom(createGameStatusAtom);
    const [currentUserId] = useAtom(currentUserIdAtom);
    const [, setGames] = useAtom(gamesAtom);
    const [errors, setErrors] = useAtom(createGameValidationsAtom);

    return {
      status,
      errors,

      validate(name, points) {
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

      async create(name, points) {
        if (errors.length > 0 || !currentUserId) {
          return;
        }

        setErrors([]);
        setStatus(CreateGameStatus.Waiting);

        const ret = await newCreateGameUseCase(
          dispatcher,
          gameRepository
        )({
          createdBy: currentUserId,
          name,
          points: points.split(",").map((v) => Number(v)),
        });

        switch (ret.kind) {
          case "success":
            setStatus(CreateGameStatus.Completed);
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

        const games = await gameRepository.listUserJoined(currentUserId);
        setGames(games);
      },
    };
  };
};

/**
 * Create Hook implementation of `UsePrepareGame`
 */
export const createUsePrepareGame = function createUsePrepareGame(gameRepository: GameRepository.T): UsePrepareGame {
  return () => {
    const [status, setStatus] = useAtom(prepareGameStatusAtom);
    const [, setCreateStatus] = useAtom(createGameStatusAtom);
    const [, setCurrentUserId] = useAtom(currentUserIdAtom);
    const [, setGames] = useAtom(gamesAtom);

    return {
      status,

      prepare(userId) {
        setStatus(PrepareGameStatus.Prepared);

        gameRepository
          .listUserJoined(userId)
          .then((games) => {
            setGames(games);
          })
          .catch(() => {
            setGames([]);
          })
          .finally(() => {
            setCreateStatus(undefined);
            setStatus(PrepareGameStatus.Prepared);
            setCurrentUserId(userId);
          });
      },
    };
  };
};
