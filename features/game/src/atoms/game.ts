import { UseLoginUser } from "@spp/feature-login";
import { Game, GameRepository, StoryPoint } from "@spp/shared-domain";
import { EventDispatcher, newCreateGameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useAtomValue } from "jotai";
import { GameDto, toGameDto } from "./dto.js";

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
  validate: (name: string, points: string) => void;

  /**
   * Create game with inputs. If this method failed, update status.
   */
  create: (name: string, points: string) => Promise<void>;
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
  prepare: () => void;
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
        if (errors.length > 0 || !userId) {
          return;
        }
        setErrors([]);
        setStatus(CreateGameStatus.Waiting);

        try {
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
        } catch (error) {
          setStatus(CreateGameStatus.Failed);
        }
      },
    };
  };
};

/**
 * Create Hook implementation of `UsePrepareGame`
 */
export const createUsePrepareGame = function createUsePrepareGame(params: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
}): UsePrepareGame {
  const { gameRepository, useLoginUser } = params;
  return () => {
    const [status, setStatus] = useAtom(prepareGameStatusAtom);
    const [, setCreateStatus] = useAtom(createGameStatusAtom);
    const [, setGames] = useAtom(gamesAtom);
    const { userId } = useLoginUser();

    return {
      status,

      prepare() {
        if (!userId) {
          return;
        }

        setStatus(PrepareGameStatus.Prepared);

        gameRepository
          .listUserCreated(userId)
          .then((games) => {
            setGames(games);
          })
          .catch(() => {
            setGames([]);
          })
          .finally(() => {
            setCreateStatus(undefined);
            setStatus(PrepareGameStatus.Prepared);
          });
      },
    };
  };
};

/**
 * Create hook implementation of `UseListGame`
 */
export const createUseListGame = function createUseListGame(useLoginUser: UseLoginUser): UseListGame {
  return () => {
    const games = useAtomValue(gamesAtom);
    const { userId } = useLoginUser();

    return {
      games: !userId ? [] : games.map((v) => toGameDto(v, userId)),
    };
  };
};
