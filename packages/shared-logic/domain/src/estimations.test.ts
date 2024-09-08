import { test, expect } from "vitest";
import * as UserEstimation from "./user-estimation.js";
import * as StoryPoint from "./story-point.js";
import * as User from "./user.js";
import { averageEstimation, calculateAverate, create, isLeastOneEstimation, update, reset } from "./estimations.js";
import { enableMapSet } from "immer";

enableMapSet();

test("should be able to create estimations", () => {
  // Arrange

  // Act
  const actual = create([User.createId("id1")]);

  // Assert
  expect(actual.userEstimations.size).toBe(1);
});

test("allow containing same id", () => {
  // Arrange

  // Act
  const actual = create([User.createId("id1"), User.createId("id1")]);

  // Assert
  expect(actual.userEstimations.size).toBe(1);
  expect(actual.userEstimations.get(User.createId("id1"))).toEqual(UserEstimation.unsubmitOf());
});

test("should throw error if users is empty", () => {
  // Arrange

  // Act

  // Assert
  expect(() => create([])).toThrowError("Can not create estimation");
});

test("should be able to update estimations with user estimation", () => {
  // Arrange
  let obj = create([User.createId("id1"), User.createId("id2")]);

  // Act
  obj = update(obj, User.createId("id1"), UserEstimation.giveUpOf());

  // Assert
  expect(obj.userEstimations.get(User.createId("id1"))).toEqual(UserEstimation.giveUpOf());
  expect(obj.userEstimations.get(User.createId("id2"))).toEqual(UserEstimation.unsubmitOf());
});

test("initial average should be zero", () => {
  // Arrange
  const obj = create([User.createId("id1"), User.createId("id2")]);

  // Act
  const value = calculateAverate(obj);

  // Assert
  expect(averageEstimation(value)).toBe(0);
});

test("get average estimation", () => {
  // Arrange
  let obj = create([User.createId("id1"), User.createId("id2")]);
  obj = update(obj, User.createId("id1"), UserEstimation.submittedOf(StoryPoint.create(5)));
  obj = update(obj, User.createId("id2"), UserEstimation.submittedOf(StoryPoint.create(3)));

  // Act
  const value = calculateAverate(obj);

  // Assert
  expect(averageEstimation(value)).toBe(4);
});

test("allow checking any estimations are not given", () => {
  // Arrange
  const obj = create([User.createId("id1")]);

  // Act
  const actual = isLeastOneEstimation(obj);

  // Assert
  expect(actual).toBeFalsy();
});

test("allow checking estimations are given", () => {
  // Arrange
  let obj = create([User.createId("id1"), User.createId("id2")]);
  obj = update(obj, User.createId("id1"), UserEstimation.submittedOf(StoryPoint.create(3)));

  // Act
  const actual = isLeastOneEstimation(obj);

  // Assert
  expect(actual).toBeTruthy();
});

test("reset estimation", () => {
  // Arrange
  let obj = create([User.createId("id1"), User.createId("id2")]);
  obj = update(obj, User.createId("id1"), UserEstimation.submittedOf(StoryPoint.create(3)));
  const resetted = reset(obj);

  // Act
  const actual = isLeastOneEstimation(obj);

  // Assert
  expect(actual).toBeFalsy();
  expect(Array.from(resetted.userEstimations.values())).toContain(UserEstimation.unsubmitOf());
  expect(Array.from(resetted.userEstimations.keys())).toEqual(Array.from(obj.userEstimations.keys()));
});
