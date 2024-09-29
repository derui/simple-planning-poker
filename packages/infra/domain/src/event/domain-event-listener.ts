import { DomainEvent } from "@spp/shared-domain";

// listener interface for domain events
export interface DomainEventListener {
  /**
   * Handle domain event
   */
  handle(event: DomainEvent.T): Promise<void>;
}
