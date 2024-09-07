import { produce } from "immer";
import * as User from "./user.js";
import { Branded } from "./type.js";

export enum UserMode {
  Normal,
  Inspector,
}

export enum PlayerType {
  Player,
  Owner,
}

const _tag: symbol = Symbol("gamePlayer");
interface Internal {
  readonly type: PlayerType;
  readonly user: User.Id;
  readonly mode: UserMode;
}

/**
 * The type of GamePlayer domain. This type can not be generate from other modules
 */
export type T = Branded<Internal, typeof _tag>;

/**
   create user from id and name
 */
export const create = ({
  type,
  user,
  mode = UserMode.Normal,
}: {
  type: PlayerType;
  user: User.Id;
  mode?: UserMode;
}): T => {
  return {
    type,
    user,
    mode,
  } as T;
};

export const createOwner = function createOwner({
  user,
  mode = UserMode.Normal,
}: {
  user: User.Id;
  mode?: UserMode;
}): T {
  return create({ type: PlayerType.Owner, user, mode });
};

/**
 * Change current user mode with new mode
 */
export const changeUserMode = (player: T, newMode: UserMode): T => {
  return produce(player, (draft) => {
    draft.mode = newMode;
  });
};
