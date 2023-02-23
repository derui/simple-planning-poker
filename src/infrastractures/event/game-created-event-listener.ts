import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { createGamePlayer } from "@/domains/game-player";

export class GameCreatedEventListener implements DomainEventListener {
  constructor(private gamePlayerRepository: GamePlayerRepository) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.GameCreated) {
      const createdPlayer = createGamePlayer({
        id: event.createdBy.gamePlayerId,
        userId: event.createdBy.userId,
        gameId: event.gameId,
      });
      this.gamePlayerRepository.save(createdPlayer);
    }
  }
}
