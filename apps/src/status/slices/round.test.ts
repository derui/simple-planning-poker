import { test, expect } from "vitest";
import { notifyRoundUpdated } from "../actions/round";
import { getInitialState, reducer } from "./round";
import { randomRound } from "@/test-lib";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import { estimated } from "@/domains/user-estimation";

test("initial state", () => {
  expect(getInitialState()).toEqual({});
});

test("should finished with finished", () => {
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const owner = User.createId();
  let round: Round.T = randomRound({ cards, theme: "theme" });
  round = Round.takePlayerEstimation(round, owner, estimated(cards[0]));
  round = Round.showDown(round as any, new Date())[0];

  const ret = reducer(getInitialState(), notifyRoundUpdated(round));

  expect(ret.instance).toEqual({
    id: round.id,
    estimations: {
      [owner]: estimated(cards[0]),
    },
    cards: {
      1: { card: cards[0], order: 0 },
      2: { card: cards[1], order: 1 },
    },
    state: "Finished",
    averagePoint: 1,
    theme: "theme",
  });
});
