import { test, expect } from "vitest";
import { estimatedPoint, giveUpOf, submittedOf, unsubmitOf } from "./user-estimation.js";
import * as StoryPoint from "./story-point.js";

test("should be able to get point", () => {
  expect(estimatedPoint(unsubmitOf())).toBeUndefined();
  expect(estimatedPoint(giveUpOf())).toBeUndefined();
  expect(estimatedPoint(submittedOf(StoryPoint.create(3)))).toEqual(StoryPoint.create(3));
});
