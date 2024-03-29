// simple state of loading

const _loading = Symbol();
const _error = Symbol();
const _finished = Symbol();

type LoadingState = [undefined, typeof _loading];
type ErrorState<E> = [E, typeof _error];
type FinishedState<T> = [T, typeof _finished];

/**
 * simple loading handler
 */
export type T<T, E = unknown> = LoadingState | ErrorState<E> | FinishedState<T>;

/**
 * check loading state is loading
 */
export const isLoading = function isLoading<Obj>(loadable: T<Obj>): loadable is LoadingState {
  return loadable[1] === _loading;
};

/**
 * check loading state is error
 */
export const isError = function isError<E>(loadable: T<unknown, E>): loadable is ErrorState<E> {
  return loadable[1] === _error;
};

/**
 * check loading state is finished
 */
export const isFinished = function isFinished<Obj>(loadable: T<Obj>): loadable is FinishedState<Obj> {
  return loadable[1] === _finished;
};

/**
 * factory function for loading
 */
export const loading = function loading(): LoadingState {
  return [undefined, _loading];
};

/**
 * factory function for error;
 */
export const error = function error<E = never>(obj?: E extends never ? never : E | undefined): ErrorState<E> {
  return [obj as E, _error];
};

/**
 * factory function for finished
 */
export const finished = function finished<T>(obj: T): FinishedState<T> {
  return [obj, _finished];
};
