import { test, expect } from "vitest";
import { between, unique } from "./index";

test("get empty array", () => {
  // Arrange

  // Act
  const ret = unique([]);

  // Assert
  expect(ret).toHaveLength(0);
});

test("get array that contains single element", () => {
  // Arrange

  // Act
  const ret = unique([1]);

  // Assert
  expect(ret).toHaveLength(1);
  expect(ret).toContainEqual(1);
});

test("remove duplicate element", () => {
  // Arrange

  // Act
  const ret = unique([1, 2, 3, 1, 3]);

  // Assert
  expect(ret).toHaveLength(3);
  expect(ret.sort()).toEqual([1, 2, 3]);
});

test("use custom compare function", () => {
  // Arrange
  type T = { bar: number };
  const fun = (v1: T, v2: T) => v1.bar === v2.bar;

  // Act
  const ret = unique([{ bar: 2 }, { bar: 3 }, { bar: 2 }], fun);

  // Assert
  expect(ret).toHaveLength(2);
  expect(ret.sort()).toEqual([{ bar: 2 }, { bar: 3 }]);
});

test("between", () => {
  expect(between(0, -1)).toEqual([]);
  expect(between(-1, 1)).toEqual([]);
  expect(between(1, 1)).toEqual([]);
  expect(between(2, 1)).toEqual([]);
  expect(between(2, 3)).toEqual([2]);
  expect(between(0, 3)).toEqual([0, 1, 2]);
});
