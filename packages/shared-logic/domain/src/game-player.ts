import { produce } from "immer";
import * as User from "./user.js";

export enum UserMode {
  Normal,
  Inspector,
}

export enum PlayerType {
  Player,
  Owner,
}

/**
 * The type of GamePlayer domain. This type can not be generate from other modules
 */
export type T = {
  readonly type: PlayerType;
  readonly user: User.Id;
  readonly mode: UserMode;
};

/**
   create user from id and name
 */
export const createPlayer = function createPlayer({
  user,
  mode = UserMode.Normal,
}: {
  user: User.Id;
  mode?: UserMode;
}): T {
  return Object.freeze({
    type: PlayerType.Player,
    user,
    mode,
  });
};

/**
 * create owner player
 */
export const createOwner = function createOwner({
  user,
  mode = UserMode.Normal,
}: {
  user: User.Id;
  mode?: UserMode;
}): T {
  return Object.freeze({ type: PlayerType.Owner, user, mode });
};

/**
 * Change current user mode with new mode
 */
export const changeUserMode = (player: T, newMode: UserMode): T => {
  return produce(player, (draft) => {
    draft.mode = newMode;
  });
};
