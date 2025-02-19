import { produce } from "immer";
import * as User from "./user.js";
import * as VoterType from "./voter-type.js";

/**
 * The type of GamePlayer domain. This type can not be generate from other modules
 */
export type T = {
  readonly user: User.Id;
  readonly type: VoterType.T;
};

/**
   create user from id and name
 */
export const createVoter = function createVoter({
  user,
  type = VoterType.Normal,
}: {
  user: User.Id;
  type?: VoterType.T;
}): T {
  return Object.freeze({
    user,
    type,
  });
};

/**
 * Change current user mode with new mode
 */
export const changeVoterType = (player: T, newType: VoterType.T): T => {
  return produce(player, (draft) => {
    draft.type = newType;
  });
};
