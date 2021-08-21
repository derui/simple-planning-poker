import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";

export class GameCreatedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.GameCreated) {
      const ref = this.database.ref(`database/${event.gameId}`);

      const cards = event.selectableCards.cards
        .filter((v) => v.kind === "storypoint")
        .map((v) => {
          switch (v.kind) {
            case "storypoint":
              return v.storyPoint.value;
            default:
              return null;
          }
        })
        .filter((v) => v !== null);

      ref.child("cards").set(cards);
      ref.child("joinedUsers").child(event.createdBy.userId).set(event.createdBy.name);
      ref.child("name").set(event.name);
      ref.child("showedDown").set(false);
    }
  }
}
