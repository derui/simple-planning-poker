import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { Card } from "@/domains/card";
import { DomainEventListener } from "./domain-event-listener";

type SerializedCard = { kind: "giveup" } | { kind: "storypoint"; value: number };

const convertCard = (card: Card): SerializedCard => {
  switch (card.kind) {
    case "storypoint":
      return {
        kind: "storypoint",
        value: card.storyPoint.value,
      };
    case "giveup":
      return { kind: "giveup" };
  }
};

export class UserCardSelectedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserCardSelected) {
      const ref = this.database.ref(`database/${event.gameId}`);

      ref.child("userHands").child(event.userId).set(convertCard(event.card));
    }

    return;
  }
}
