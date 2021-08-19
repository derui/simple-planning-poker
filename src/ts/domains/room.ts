import { createId, Id } from "./base";
import { EventFactory, NewGameStarted } from "./event";
import { createGame, Game } from "./game";
import { SelectableCards } from "./selectable-cards";
import { User, UserId } from "./user";

export type RoomId = Id<"Room">;

export const createRoomId = () => createId<"Room">();

export interface Room {
  get id(): RoomId;
  get name(): string;
  get joinedUsers(): UserId[];
  get selectableCards(): SelectableCards;
  get currentGame(): Game;

  changeName(name: string): void;

  canChangeName(name: string): boolean;

  // join user to this room
  acceptToBeJoinedBy(user: User): void;

  // return true if room can accept to join user
  canAcceptToBeJoinedBy(user: User): boolean;

  // start new game
  newGame(): NewGameStarted;
}

type InternalRoom = Room & { roomName: string; _joinedUsers: UserId[]; _game: Game };
/**
   create room from id and name
 */
export const createRoomByUser = (id: RoomId, name: string, selectableCards: SelectableCards, user: User): Room => {
  if (name === "") {
    throw new Error("can not create room with empty name");
  }

  return {
    roomName: name,
    _joinedUsers: [user.id],
    _game: createGame([user.id]),

    get id() {
      return id;
    },

    get name() {
      return this.roomName;
    },

    get joinedUsers() {
      return this._joinedUsers;
    },

    get selectableCards() {
      return selectableCards;
    },

    get currentGame() {
      return this._game;
    },

    changeName(name: string) {
      if (!this.canChangeName(name)) {
        throw new Error("can not change name");
      }
      this.roomName = name;
    },

    canChangeName(name: string) {
      return name !== "";
    },

    acceptToBeJoinedBy(user: User) {
      if (!this.canAcceptToBeJoinedBy(user)) {
        return;
      }

      this._joinedUsers.push(user.id);
    },

    canAcceptToBeJoinedBy(user: User): boolean {
      return !this._joinedUsers.some((v) => v === user.id);
    },

    newGame() {
      this._game = createGame(this.joinedUsers);

      return EventFactory.newGameStarted();
    },
  } as InternalRoom;
};
