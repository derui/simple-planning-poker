import { EventFactory, GameJoinedUserModeChanged } from "./event";
import { User, UserId } from "./user";

export const UserMode = {
  normal: "normal",
  inspector: "inspector",
} as const;
export type UserMode = typeof UserMode[keyof typeof UserMode];

export interface GameJoinedUser {
  get userId(): UserId;
  get name(): string;
  get mode(): UserMode;

  changeUserMode(newMode: UserMode): GameJoinedUserModeChanged;
}

/**
   create user from id and name
 */
export const createGameJoinedUser = (
  userId: UserId,
  name: string,
  mode: UserMode = UserMode.normal
): GameJoinedUser => {
  if (name === "") {
    throw new Error("can not create user with empty name");
  }

  return {
    userName: name,
    userMode: mode,

    get userId() {
      return userId;
    },

    get name() {
      return this.userName;
    },

    get mode() {
      return this.userMode;
    },

    changeUserMode(newMode: UserMode) {
      this.userMode = newMode;

      return EventFactory.gameJoinedUserModeChanged(this.userId, newMode);
    },
  } as GameJoinedUser & { userName: string; userMode: UserMode };
};

/**
   create user from id and name
 */
export const createGameJoinedUserFromUser = (user: User, mode: UserMode = UserMode.normal): GameJoinedUser => {
  const userId = user.id;
  const name = user.name;
  return {
    userName: name,
    userMode: mode,

    get userId() {
      return userId;
    },

    get name() {
      return this.userName;
    },

    get mode() {
      return this.userMode;
    },

    changeUserMode(newMode: UserMode) {
      this.userMode = newMode;

      return EventFactory.gameJoinedUserModeChanged(this.userId, newMode);
    },
  } as GameJoinedUser & { userName: string; userMode: UserMode };
};
