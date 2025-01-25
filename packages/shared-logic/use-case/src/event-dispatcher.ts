import { DomainEvent } from "@spp/shared-domain";

export type Subscriber = (event: DomainEvent.T) => void;
export type Unsubscribe = () => void;

const subscriptions = new Set<Subscriber>();

/**
 * Dispatch `event` to any other places
 */
export const dispatch = (event: DomainEvent.T): void => {
  subscriptions.forEach((subscriber) => subscriber(event));
};

/**
 * Clear all subscriptions
 */
export const clearSubsctiptions = (): void => {
  subscriptions.clear();
};

/**
 * Subscribe to `event`
 */
export const subscribe = (subscriber: Subscriber): Unsubscribe => {
  subscriptions.add(subscriber);

  return () => {
    subscriptions.delete(subscriber);
  };
};
