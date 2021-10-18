import { DefinedDomainEvents, DOMAIN_EVENTS } from "~/src/ts/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { GamePlayerRepository } from "~/src/ts/domains/game-player-repository";
import { createGamePlayer } from "~/src/ts/domains/game-player";

export class GameCreatedEventListener implements DomainEventListener {
  constructor(private gamePlayerRepository: GamePlayerRepository) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.GameCreated) {
      const createdPlayer = createGamePlayer({
        id: event.createdBy.gamePlayerId,
        userId: event.createdBy.userId,
        gameId: event.gameId,
        cards: event.selectableCards,
      });
      this.gamePlayerRepository.save(createdPlayer);
    }
  }
}
