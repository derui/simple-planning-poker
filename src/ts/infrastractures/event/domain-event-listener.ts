import { DefinedDomainEvents } from "~/src/ts/domains/event";

// listener interface for domain events
export interface DomainEventListener {
  handle(event: DefinedDomainEvents): void;
}
