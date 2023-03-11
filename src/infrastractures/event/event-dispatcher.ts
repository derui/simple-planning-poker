import { DomainEventListener } from "./domain-event-listener";
import { GenericDomainEvent } from "@/domains/event";
import { EventDispatcher } from "@/usecases/base";

export class EventDispatcherImpl implements EventDispatcher {
  constructor(private listeners: DomainEventListener[]) {}

  dispatch(event: GenericDomainEvent): void {
    this.listeners.forEach((v) => v.handle(event));
  }
}
