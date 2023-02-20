import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { DomainEventListener } from "./domain-event-listener";

export class UserLeaveFromGameEventListener implements DomainEventListener {
  constructor(private gamePlayerRepository: GamePlayerRepository) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind === DOMAIN_EVENTS.UserLeavedFromGame) {
      this.gamePlayerRepository.findBy(event.gamePlayerId).then((player) => {
        if (player) {
          this.gamePlayerRepository.delete(player);
        }
      });
    }
  }
}
