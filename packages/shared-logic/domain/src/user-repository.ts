import * as User from "./user.js";

export interface UserRepository {
  /**
   * Save user state
   */
  save: UserRepository.Save;

  /**
   * Find user by ID
   */
  findBy: UserRepository.FindBy;

  /**
   * List users in list of identifiers
   */
  listIn: UserRepository.ListIn;
}

/**
 * A default instance of UserRepository.
 *
 * User must replace this with a real implementation.
 */
export const UserRepository: UserRepository = {
  save: () => {
    throw new Error("Function not implemented.");
  },
  findBy: () => {
    throw new Error("Function not implemented.");
  },
  listIn: () => {
    throw new Error("Function not implemented.");
  },
};

// define structured types
export namespace UserRepository {
  export namespace Save {
    export interface Params {
      user: User.T;
    }

    export type Result = void;
  }

  export type Save = (params: Save.Params) => Promise<Save.Result>;

  export namespace FindBy {
    export type Params = {
      id: User.Id;
    };
    export type Result = User.T | undefined;
  }

  export type FindBy = (params: FindBy.Params) => Promise<FindBy.Result>;

  export namespace ListIn {
    export type Params = {
      users: User.Id[];
    };
    export type Result = User.T[];
  }

  export type ListIn = (params: ListIn.Params) => Promise<ListIn.Result>;
}
