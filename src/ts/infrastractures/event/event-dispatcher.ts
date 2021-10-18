import { DefinedDomainEvents } from "~/src/ts/domains/event";
import { EventDispatcher } from "~/src/ts/usecases/base";
import { DomainEventListener } from "./domain-event-listener";

export class EventDispatcherImpl implements EventDispatcher {
  constructor(private listeners: DomainEventListener[]) {}

  dispatch(event: DefinedDomainEvents): void {
    this.listeners.forEach((v) => v.handle(event));
  }
}
