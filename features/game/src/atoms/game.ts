import { ApplicablePoints, Game, GameRepository, StoryPoint, User, Voting } from "@spp/shared-domain";
import { EventDispatcher } from "@spp/shared-use-case";
import { atom, useAtom } from "jotai";

/**
 * Current user id in this feature.
 */
const currentUserIdAtom = atom<User.Id | undefined>();

/**
 * games that are owned by or joined by an user
 */
const gamesAtom = atom<Game.T[]>([]);

/**
 * Games that are owned by an user
 */
const ownedGamesAtom = atom<Game.T[]>((get) => {
  const userId = get(currentUserIdAtom);

  if (!userId) {
    return [];
  }

  return get(gamesAtom).filter((v) => v.owner == userId);
});

/**
 * Games that an user is joined to
 */
const joinedGamesAtom = atom<Game.T[]>((get) => {
  const userId = get(currentUserIdAtom);

  if (!userId) {
    return [];
  }

  return get(gamesAtom).filter((v) => v.owner != userId);
});

/**
 * A validation errors
 */
export type CreateGameValidation = "InvalidName" | "InvalidPoints" | "NameConflicted";

/**
 * Status enum of game creating
 */
export enum CreateGameStatus {
  /**
   * Preparing state is preparing to create
   */
  Preparing = "preparing",

  /**
   * Prepared state is preparing finished
   */
  Prepared = "prepared",

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

const createGameStatusAtom = atom<CreateGameStatus>(CreateGameStatus.Preparing);

// Hook definitions

/**
 * Hook definition to create game
 */
export type UseCreateGame = () => {
  status: CreateGameStatus;

  /**
   * Return creatable or not with inputs.
   *
   * @param name current input for name
   * @param points current input for points
   */
  canCreate(name: string, points: string): CreateGameValidation[];

  /**
   * Create game with inputs. If this method failed, update status.
   */
  create(name: string, points: string): Promise<void>;

  /**
   * Prepare for creation
   */
  prepare(userId: User.Id): void;
};

// hook implementations
export const createUseCreateGame = function createUseCreateGame(
  gameRepository: GameRepository.T,
  dispatcher: EventDispatcher
): UseCreateGame {
  return () => {
    const [status, setStatus] = useAtom(createGameStatusAtom);
    const [ownedGames] = useAtom(ownedGamesAtom);
    const [currentUserId, setCurrentUserId] = useAtom(currentUserIdAtom);
    const [, setGames] = useAtom(gamesAtom);

    return {
      status,

      canCreate(name, points) {
        const errors: CreateGameValidation[] = [];
        if (!Game.canChangeName(name)) {
          errors.push("InvalidName");
        } else if (ownedGames.find((v) => v.name == name.trim())) {
          errors.push("NameConflicted");
        }

        const normalizedPoints = points.split(",").map((v) => v.trim());

        if (normalizedPoints.length == 0) {
          errors.push("InvalidPoints");
        }

        if (!normalizedPoints.every((v) => v.match(/^[0-9]$/))) {
          errors.push("InvalidPoints");
        }

        return errors;
      },

      prepare(userId) {
        gameRepository
          .listUserJoined(userId)
          .then((games) => {
            setGames(games);
          })
          .catch(() => {
            setGames([]);
          })
          .finally(() => {
            setStatus(CreateGameStatus.Prepared);
            setCurrentUserId(userId);
          });
      },

      async create(name, points) {
        if (this.canCreate(name, points).length > 0 || !currentUserId) {
          return;
        }

        setStatus(CreateGameStatus.Waiting);
        const [game, event] = Game.create({
          id: Game.createId(),
          name,
          points: ApplicablePoints.create(points.split(",").map((v) => StoryPoint.create(Number(v)))),
          owner: currentUserId,
          voting: Voting.createId(),
        });
        try {
          await gameRepository.save(game);
        } catch (e) {
          setStatus(CreateGameStatus.Failed);
          console.warn(e);
          return;
        }

        dispatcher(event);

        setStatus(CreateGameStatus.Completed);

        const games = await gameRepository.listUserJoined(currentUserId);
        setGames(games);
      },
    };
  };
};
