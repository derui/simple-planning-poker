import { createId, Id } from "./base";

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
} as const;

export type DomainEvents = { [key in keyof typeof DOMAIN_EVENTS]: typeof DOMAIN_EVENTS[key] };

// define domain events

export interface NewGameStarted extends Event<DomainEvents["NewGameStarted"]> {}

export const EventFactory = {
  newGameStarted(): NewGameStarted {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.NewGameStarted,
    };
  },
};
