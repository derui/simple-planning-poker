import { unique } from "@/utils/array";
import { create, Id } from "./base";
import { EventFactory, UserLeavedFromGame, UserNameChanged } from "./event";
import { GameId } from "./game";
import { GamePlayerId } from "./game-player";

export type UserId = Id<"User">;

export const createUserId = (value?: string): UserId => {
  if (value) {
    return value as UserId;
  } else {
    return create<"User">();
  }
};

export interface JoinedGame {
  gameId: GameId;
  playerId: GamePlayerId;
}

export interface User {
  get id(): UserId;
  get name(): string;
  get joinedGames(): JoinedGame[];

  // change name
  changeName(name: string): UserNameChanged;

  // can change name with given value
  canChangeName(name: string): boolean;

  isJoined(gameId: GameId): boolean;

  findJoinedGame(gameId: GameId): JoinedGame | undefined;

  leaveFrom(gameId: GameId): UserLeavedFromGame | undefined;
}

const equalJoinedGame = (v1: JoinedGame, v2: JoinedGame) => {
  return v1.gameId === v2.gameId && v1.playerId === v2.playerId;
};

/**
   create user from id and name
 */
export const createUser = ({
  id,
  name,
  joinedGames,
}: {
  id: UserId;
  name: string;
  joinedGames: JoinedGame[];
}): User => {
  if (name === "") {
    throw new Error("can not create user with empty name");
  }
  const games = unique(joinedGames, equalJoinedGame);

  const obj = {
    _userName: name,
    _games: games,
    get id() {
      return id;
    },

    get name() {
      return obj._userName;
    },

    get joinedGames() {
      return obj._games;
    },

    changeName(name: string) {
      if (!obj.canChangeName(name)) {
        throw new Error("can not change name");
      }
      obj._userName = name;

      return EventFactory.userNameChanged(obj.id, name);
    },

    canChangeName(name: string) {
      return name !== "";
    },

    isJoined(gameId: GameId) {
      return obj.joinedGames.some((v) => v.gameId === gameId);
    },

    findJoinedGame(gameId: GameId) {
      return obj.joinedGames.find((v) => v.gameId === gameId);
    },

    leaveFrom(gameId: GameId) {
      const leavedGame = obj.findJoinedGame(gameId);
      if (!leavedGame) {
        return;
      }

      this._games = this._games.filter((v) => v.gameId !== gameId);

      return EventFactory.userLeaveFromGame(obj.id, leavedGame.playerId, leavedGame.gameId);
    },
  } as User & { _userName: string; _games: JoinedGame[] };

  return obj;
};
