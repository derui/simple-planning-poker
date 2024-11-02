import { describe, expect, test } from "vitest";
import * as ApplicablePoints from "./applicable-points.js";
import { changeName, changePoints, create, createId, isGameCreated, newVoting } from "./game.js";
import { Voter } from "./index.js";
import * as StoryPoint from "./story-point.js";
import * as User from "./user.js";

const points = ApplicablePoints.create([1, 2].map(StoryPoint.create));

test("get aggregate and event when game created ", () => {
  const [game, event] = create({
    id: createId("id"),
    name: "name",
    owner: User.createId("user"),
    points,
  });

  expect(game.id).toBe(createId("id"));

  if (isGameCreated(event)) {
    expect(game.id).toBe(event.gameId);
    expect(event.createdBy).toBe(User.createId("user"));
    expect(event.name).toBe("name");
  } else {
    expect.fail("event should be GameCreated");
  }
  expect(game.name).toBe("name");
  expect(game.owner).toEqual(User.createId("user"));
});

describe("game name", () => {
  const [game] = create({
    id: createId("id"),
    name: "name",
    owner: User.createId("user"),
    points: points,
  });

  test("can change name of game", () => {
    const changed = changeName(game, "changed name");

    expect(changed.name).toBe("changed name");
  });

  test("should throw error if name is not valid", () => {
    expect(() => changeName(game, "")).toThrowError(/can not change name/);
    expect(() => changeName(game, "   \t ")).toThrowError(/can not change name/);
  });
});

describe("game points", () => {
  const [game] = create({
    id: createId("id"),
    name: "name",
    owner: User.createId("user"),
    points: points,
  });

  test("can change points", () => {
    const newPoints = ApplicablePoints.create([1, 3, 5].map(StoryPoint.create));
    const changed = changePoints(game, newPoints);

    expect(changed.points).toEqual(newPoints);
  });
});

describe("create voting", () => {
  test("should be able to create new voting from game", () => {
    // Arrange
    const [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      points: points,
    });

    // Act
    const voting = newVoting(game);

    // Assert
    expect(voting.theme).toBeUndefined();
    expect(voting.participatedVoters).toHaveLength(1);
    expect(voting.participatedVoters).toEqual(
      expect.arrayContaining([Voter.createVoter({ user: User.createId("user") })])
    );
    expect(voting.points).toEqual(game.points);
  });
});
