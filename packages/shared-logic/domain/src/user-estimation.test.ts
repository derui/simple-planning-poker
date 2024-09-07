import { test, expect } from "vitest";
import { giveUp, estimated, kindOf, unselected } from "./user-estimation.js";
import * as Card from "./card.js";
import * as StoryPoint from "./story-point.js";

test("should be able to get kind", () => {
  expect(kindOf(unselected())).toBe("unselected");
  expect(kindOf(giveUp())).toBe("giveup");
  expect(kindOf(estimated(Card.create(StoryPoint.create(3))))).toBe("estimated");
});
