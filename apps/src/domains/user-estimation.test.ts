import { test, expect } from "vitest";
import { giveUp, estimated, kindOf, unselected } from "./user-estimation";
import * as Card from "./card";
import * as StoryPoint from "./story-point";

test("should be able to get kind", () => {
  expect(kindOf(unselected())).toBe("unselected");
  expect(kindOf(giveUp())).toBe("giveup");
  expect(kindOf(estimated(Card.create(StoryPoint.create(3))))).toBe("estimated");
});
