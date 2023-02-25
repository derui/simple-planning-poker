import produce from "immer";
import * as User from "./user";

export const UserMode = {
  normal: "normal",
  inspector: "inspector",
} as const;
export type UserMode = (typeof UserMode)[keyof typeof UserMode];

export interface T {
  readonly user: User.Id;
  readonly mode: UserMode;
}

/**
   create user from id and name
 */
export const create = ({ userId, mode = UserMode.normal }: { userId: User.Id; mode?: UserMode }): T => {
  return {
    user: userId,
    mode: mode,
  };
};

export const changeUserMode = (player: T, newMode: UserMode): T => {
  return produce(player, (draft) => {
    draft.mode = newMode;
  });
};
