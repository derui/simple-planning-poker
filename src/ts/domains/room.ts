import { createId, Id } from "./base";
import { SelectableCards } from "./selectable-cards";
import { User, UserId } from "./user";

export type RoomId = Id<"Room">;

export const createRoomId = () => createId<"Room">();

export interface Room {
  get id(): RoomId;
  get name(): string;
  get joinedUsers(): UserId[];
  get selectableCards(): SelectableCards;

  changeName(name: string): void;

  canChangeName(name: string): boolean;

  // join user to this room
  acceptToBeJoinedBy(user: User): void;

  // return true if room can accept to join user
  canAcceptToBeJoinedBy(user: User): boolean;
}

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
  } as Room & { roomName: string; _joinedUsers: UserId[] };
};
