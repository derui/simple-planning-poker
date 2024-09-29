import { DomainEventListener } from "./domain-event-listener.js";
import { EventDispatcher } from "@spp/shared-use-case";

/**
 * Get new event dispatcher
 */
export const newEventDispatcher = function newEventDispatcher(listeners: DomainEventListener[]): EventDispatcher {
  return (event): void => {
    Promise.allSettled(listeners.map((v) => v.handle(event)))
      .then(() => {})
      .catch(() => {});
  };
};
