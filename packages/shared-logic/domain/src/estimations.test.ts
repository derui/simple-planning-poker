import { test, expect } from "vitest";
import * as UserEstimation from "./user-estimation.js";
import * as StoryPoint from "./story-point.js";
import * as User from "./user.js";
import {
  averageEstimation,
  calculateAverate,
  empty,
  isLeastOneEstimation,
  update,
  reset,
  from,
  estimationOfUser,
} from "./estimations.js";
import { enableMapSet } from "immer";

enableMapSet();

test("should be able to create estimations", () => {
  // Arrange

  // Act
  const actual = empty();

  // Assert
  expect(actual.userEstimations.size).toBe(0);
});

test("create from estimation like object", () => {
  // Arrange

  // Act
  const actual = from({
    [User.createId("id1")]: UserEstimation.giveUpOf(),
  });

  // Assert
  expect(actual.userEstimations.size).toBe(1);
  expect(actual.userEstimations.get(User.createId("id1"))).toEqual(UserEstimation.giveUpOf());
});

test("should throw error if users is empty", () => {
  // Arrange

  // Act

  // Assert
  expect(() => from({})).toThrowError("Can not create estimation");
});

test("should be able to update estimations with user estimation", () => {
  // Arrange
  let obj = empty();

  // Act
  obj = update(obj, User.createId("id1"), UserEstimation.giveUpOf());

  // Assert
  expect(estimationOfUser(obj, User.createId("id1"))).toEqual(UserEstimation.giveUpOf());
  expect(estimationOfUser(obj, User.createId("id2"))).toEqual(UserEstimation.unsubmitOf());
});

test("initial average should be zero", () => {
  // Arrange
  const obj = empty();

  // Act
  const value = calculateAverate(obj);

  // Assert
  expect(averageEstimation(value)).toBe(0);
});

test("get average estimation", () => {
  // Arrange
  let obj = empty();
  obj = update(obj, User.createId("id1"), UserEstimation.submittedOf(StoryPoint.create(5)));
  obj = update(obj, User.createId("id2"), UserEstimation.submittedOf(StoryPoint.create(3)));

  // Act
  const value = calculateAverate(obj);

  // Assert
  expect(averageEstimation(value)).toBe(4);
});

test("allow checking any estimations if empty", () => {
  // Arrange
  const obj = empty();

  // Act
  const actual = isLeastOneEstimation(obj);

  // Assert
  expect(actual).toBeFalsy();
});

test("allow checking any estimations if empty", () => {
  // Arrange
  let obj = empty();
  obj = update(obj, User.createId("id1"), UserEstimation.unsubmitOf());

  // Act
  const actual = isLeastOneEstimation(obj);

  // Assert
  expect(actual).toBeFalsy();
});

test("allow checking estimations are given", () => {
  // Arrange
  let obj = empty();
  obj = update(obj, User.createId("id1"), UserEstimation.submittedOf(StoryPoint.create(3)));

  // Act
  const actual = isLeastOneEstimation(obj);

  // Assert
  expect(actual).toBeTruthy();
});

test("reset estimation", () => {
  // Arrange
  let obj = empty();
  obj = update(obj, User.createId("id1"), UserEstimation.submittedOf(StoryPoint.create(3)));
  const resetted = reset(obj);

  // Act
  const actual = isLeastOneEstimation(resetted);

  // Assert
  expect(actual).toBeFalsy();
  expect(Array.from(resetted.userEstimations.values())).containSubset([UserEstimation.unsubmitOf()]);
  expect(Array.from(resetted.userEstimations.keys())).toEqual(Array.from(obj.userEstimations.keys()));
});
