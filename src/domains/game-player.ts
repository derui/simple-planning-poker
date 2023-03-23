import produce from "immer";
import * as User from "./user";

export const UserMode = {
  normal: "normal",
  inspector: "inspector",
} as const;
export type UserMode = (typeof UserMode)[keyof typeof UserMode];

export const PlayerType = {
  player: "player",
  owner: "owner",
} as const;
export type PlayerType = (typeof PlayerType)[keyof typeof PlayerType];

export interface T {
  readonly type: PlayerType;
  readonly user: User.Id;
  readonly mode: UserMode;
}

/**
   create user from id and name
 */
export const create = ({
  type,
  user,
  mode = UserMode.normal,
}: {
  type: PlayerType;
  user: User.Id;
  mode?: UserMode;
}): T => {
  return {
    type,
    user,
    mode,
  };
};

export const createOwner = function createOwner({
  user,
  mode = UserMode.normal,
}: {
  user: User.Id;
  mode?: UserMode;
}): T {
  return create({ type: PlayerType.owner, user, mode });
};

export const changeUserMode = (player: T, newMode: UserMode): T => {
  return produce(player, (draft) => {
    draft.mode = newMode;
  });
};
