import { unique } from "@/utils/array";
import produce from "immer";
import * as Base from "./base";
import { DomainEvent } from "./event";
import * as EventFactory from "./event-factory";
import * as Game from "./game";
import * as GamePlayer from "./game-player";

export type Id = Base.Id<"User">;

export const createId = (value?: string): Id => {
  if (value) {
    return value as Id;
  } else {
    return Base.create<"User">();
  }
};

export interface JoinedGame {
  gameId: Game.Id;
  playerId: GamePlayer.Id;
}

export interface T {
  readonly id: Id;
  readonly name: string;
  readonly joinedGames: JoinedGame[];
}

const equalJoinedGame = (v1: JoinedGame, v2: JoinedGame) => {
  return v1.gameId === v2.gameId && v1.playerId === v2.playerId;
};

/**
   create user from id and name
 */
export const createUser = ({ id, name, joinedGames }: { id: Id; name: string; joinedGames: JoinedGame[] }): T => {
  if (name === "") {
    throw new Error("can not create user with empty name");
  }
  const games = unique(joinedGames, equalJoinedGame);

  return {
    id,
    name,
    get joinedGames() {
      return Array.from(games);
    },
  };
};

export const canChangeName = (name: string) => {
  return name !== "";
};

export const changeName = (user: T, name: string): [T, DomainEvent] => {
  if (!canChangeName(name)) {
    throw new Error("can not change name");
  }

  return [
    produce(user, (draft) => {
      draft.name = name;
    }),
    EventFactory.userNameChanged(user.id, name),
  ];
};

export const findJoinedGame = (user: T, gameId: Game.Id) => {
  return user.joinedGames.find((v) => v.gameId === gameId);
};

export const isJoined = (user: T, gameId: Game.Id) => {
  return !!findJoinedGame(user, gameId);
};

export const leaveFrom = (user: T, gameId: Game.Id): [T, DomainEvent?] => {
  const leavedGame = findJoinedGame(user, gameId);
  if (!leavedGame) {
    return [user];
  }

  const games = user.joinedGames.filter((v) => v.gameId !== gameId);

  return [
    produce(user, (draft) => {
      draft.joinedGames = games;
    }),
    EventFactory.userLeaveFromGame(user.id, leavedGame.playerId, leavedGame.gameId),
  ];
};
