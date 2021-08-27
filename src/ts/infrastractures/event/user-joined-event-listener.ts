import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { UserRepository } from "@/domains/user-repository";

export class UserJoinedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database, private userRepository: UserRepository) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserJoined) {
      this.userRepository.findBy(event.userId).then((user) => {
        if (!user) {
          return;
        }
        const ref = this.database.ref(`games/${event.gameId}`);

        ref.child("users").child(event.userId).set(user.name);
        ref.child(`joinedGames/${event.gameId}`).set(true);
      });
    }

    return;
  }
}
