import * as Game from "./game.js";
import * as User from "./user.js";

/**
 * Interface for GameRepository
 */
export interface GameRepository {
  /**
   * save game entity into repository
   */
  save: GameRepository.Save;

  /**
   * Find game by id
   */
  findBy: GameRepository.FindBy;

  /**
   * list games specified user created
   */
  listUserCreated: GameRepository.ListUserCreated;

  /**
   * Delete a game by id.
   *
   * @param game the game to delete
   */
  delete: GameRepository.Delete;
}

/**
 * A default instance of GameRepository.
 *
 * User must use real implementation
 */
export const GameRepository: GameRepository = {
  save: () => {
    throw new Error("Function not implemented.");
  },
  findBy: () => {
    throw new Error("Function not implemented.");
  },
  listUserCreated: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

/**
 * Structured type for GameRepository
 */
export namespace GameRepository {
  export namespace Save {
    export interface Params {
      game: Game.T;
    }

    export type Result = void;
  }

  export type Save = (params: Save.Params) => Promise<Save.Result>;

  export namespace FindBy {
    export interface Params {
      id: Game.Id;
    }

    export type Result = Game.T | undefined;
  }

  export type FindBy = (params: FindBy.Params) => Promise<FindBy.Result>;

  export namespace ListUserCreated {
    export interface Params {
      user: User.Id;
    }

    export type Result = Game.T[];
  }

  export type ListUserCreated = (params: ListUserCreated.Params) => Promise<ListUserCreated.Result>;

  export namespace Delete {
    export interface Params {
      game: Game.T;
    }

    export type Result = void;
  }

  export type Delete = (params: Delete.Params) => Promise<Delete.Result>;
}
