import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { UserRepository } from "@/domains/user-repository";
import { UserMode } from "@/domains/game-joined-user";
import { Database, ref, update } from "firebase/database";

export class UserJoinedEventListener implements DomainEventListener {
  constructor(private database: Database, private userRepository: UserRepository) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserJoined) {
      this.userRepository.findBy(event.userId).then((user) => {
        if (!user) {
          return;
        }
        const updates: { [key: string]: any } = {};
        updates[`games/${event.gameId}/users/${event.userId}/name`] = user.name;
        updates[`games/${event.gameId}/users/${event.userId}/mode`] = UserMode.normal;
        updates[`users/${event.userId}/joinedGames/${event.gameId}`] = true;

        update(ref(this.database), updates);
      });
    }

    return;
  }
}
