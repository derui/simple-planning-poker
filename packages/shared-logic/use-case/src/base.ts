/**
 * Execute use case with Input/Output
 */
export type UseCase<I, O> = (input: I) => Promise<O>;
