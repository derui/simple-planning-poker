import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { UserRepository } from "@/domains/user-repository";
import { UserMode } from "@/domains/game-joined-user";

export class UserJoinedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database, private userRepository: UserRepository) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserJoined) {
      this.userRepository.findBy(event.userId).then((user) => {
        if (!user) {
          return;
        }
        const ref = this.database.ref();
        const updates: { [key: string]: any } = {};
        updates[`games/${event.gameId}/users/${event.userId}/name`] = user.name;
        updates[`games/${event.gameId}/users/${event.userId}/mode`] = UserMode.normal;
        updates[`users/${event.userId}/joinedGames/${event.gameId}`] = true;

        ref.update(updates);
      });
    }

    return;
  }
}
