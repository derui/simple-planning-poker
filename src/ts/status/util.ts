type ValueFuture<T> = {
  state: "value";
  contents: T;
  valueMaybe(): T;
};

type ErrorFuture = {
  state: "error";
  valueMaybe(): undefined;
};

type PendingFuture = {
  state: "pending";
  valueMaybe(): undefined;
};

export type Future<T> = ValueFuture<T> | ErrorFuture | PendingFuture;
