import { DomainEvent } from "@spp/shared-domain";

/**
 * Execute use case with Input/Output
 */
export type UseCase<I, O = void> = (input: I) => Promise<O>;

/**
 * Dispatch `event` to any other places
 */
export type EventDispatcher = (event: DomainEvent.T) => void;
