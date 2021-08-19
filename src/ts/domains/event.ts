import { createId, Id } from "./base";
import { RoomId } from "./room";
import { UserId } from "./user";

export type EventId = Id<"Event">;

// A base event interface
export interface Event<Kind extends string> {
  id: EventId;
  kind: Kind;
}

// create event id
export const createEventId = (): EventId => createId<"Event">();

// define event kinds

export const DOMAIN_EVENTS = {
  NewGameStarted: "NewGameStarted",
  UserNameChanged: "UserNameChanged",
  UserJoined: "UserJoined",
} as const;

export type DomainEvents = { [key in keyof typeof DOMAIN_EVENTS]: typeof DOMAIN_EVENTS[key] };

// define domain events

export interface NewGameStarted extends Event<DomainEvents["NewGameStarted"]> {}
export interface UserNameChanged extends Event<DomainEvents["UserNameChanged"]> {
  userId: UserId;
  name: string;
}

export interface UserJoined extends Event<DomainEvents["UserJoined"]> {
  roomId: RoomId;
  userId: UserId;
  name: string;
}

export const EventFactory = {
  newGameStarted(): NewGameStarted {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.NewGameStarted,
    };
  },

  userNameChanged(userId: UserId, name: string): UserNameChanged {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.UserNameChanged,
      userId,
      name,
    };
  },

  userJoined(roomId: RoomId, userId: UserId, name: string): UserJoined {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.UserJoined,
      roomId,
      userId,
      name,
    };
  },
};
