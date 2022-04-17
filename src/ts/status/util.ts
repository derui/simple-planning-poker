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

export const valueOf = <T>(value: T): ValueFuture<T> => ({
  state: "value",
  contents: value,
  valueMaybe() {
    return value;
  },
});

export const errorOf = (): ErrorFuture => ({
  state: "error",
  valueMaybe() {
    return undefined;
  },
});

export const pendingOf = (): PendingFuture => ({
  state: "pending",
  valueMaybe() {
    return undefined;
  },
});

export const mapFuture = <T, V>(future: Future<T>, f: (value: T) => V): Future<V> => {
  switch (future.state) {
    case "value":
      return valueOf(f(future.contents));
    case "error":
      return errorOf();
    case "pending":
      return pendingOf();
  }
};
