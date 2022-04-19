import { errorOf, mapFuture, pendingOf, valueOf } from "./util";

test("return error if mapFuture is given error", () => {
  const future = errorOf();

  const actual = mapFuture(future, (f) => console.log(f));

  expect(actual.state).toEqual(future.state);
});

test("return pending if mapFuture is given pending", () => {
  const future = pendingOf();

  const actual = mapFuture(future, (f) => console.log(f));

  expect(actual.state).toEqual(future.state);
});

test("return given value if mapFuture is given value", () => {
  const future = valueOf(5);

  const actual = mapFuture(future, (f) => `${f * 5}`);

  expect(actual.valueMaybe()).toEqual("25");
});
