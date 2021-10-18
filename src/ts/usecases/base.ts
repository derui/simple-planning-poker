import { DefinedDomainEvents } from "~/src/ts/domains/event";

// base interface for use case
export interface UseCase<I, O = void> {
  execute(input: I): O;
}

// interface to dispatch event
export interface EventDispatcher {
  dispatch(event: DefinedDomainEvents): void;
}
