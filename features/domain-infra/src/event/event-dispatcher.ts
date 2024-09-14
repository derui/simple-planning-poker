import { DomainEventListener } from "./domain-event-listener.js";
import { DomainEvent } from "@/domains/event";
import { EventDispatcher } from "@/usecases/base";

export class EventDispatcherImpl implements EventDispatcher {
  constructor(private listeners: DomainEventListener[]) {}

  dispatch(event: DomainEvent): void {
    this.listeners.forEach((v) => v.handle(event));
  }
}
