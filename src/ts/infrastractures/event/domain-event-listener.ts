import { DefinedDomainEvents } from "@/domains/event";

// listener interface for domain events
export interface DomainEventListener {
  handle(event: DefinedDomainEvents): void;
}
