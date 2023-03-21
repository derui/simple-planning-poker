import { expect, test, describe } from "vitest";
import { firstValueFrom, NEVER, of } from "rxjs";
import { StateObservable } from "redux-observable";
import sinon from "sinon";
import { createPureStore } from "../store";
import { signInSuccess } from "../actions/signin";
import { roundEpic } from "./round";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import * as Cards from "@/domains/selectable-cards";
import * as SP from "@/domains/story-point";
import * as RoundAction from "@/status/actions/round";
import * as UserEstimation from "@/domains/user-estimation";
import { createMockedEstimatePlayerUseCase, createMockedShowDownUseCase, randomGame, randomRound } from "@/test-lib";

const CARDS = Cards.create([1, 2, 3].map(SP.create));

describe("giveUp", () => {
  test("should error if game is not opened", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("Can not give up with nullish"));
  });

  test("should error if user is not set", async () => {
    const round = randomRound();
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(RoundAction.notifyRoundUpdated(round));

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("Can not give up with nullish"));
  });

  test("get changed game", async () => {
    const user = User.create({ id: User.createId(), name: "foo" });
    let round = randomRound({ cards: CARDS });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Round.takePlayerEstimation(round, user.id, UserEstimation.giveUp());

    registrar.register(
      "estimatePlayerUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.resolves({ kind: "success", round: expected }),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(RoundAction.notifyRoundUpdated(round));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.giveUpSuccess(expected));
  });

  test("should get error", async () => {
    const user = User.create({ id: User.createId(), name: "foo" });
    const round = randomRound({ cards: CARDS });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "estimatePlayerUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.rejects("error"),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(RoundAction.notifyRoundUpdated(round));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("failed with exception"));
  });
});

describe("estimate", () => {
  test("should error if game is not opened", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();

    const action$ = of(RoundAction.estimate({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.estimate(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("Can not give up with nullish"));
  });

  test("should error if user is not set", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();
    const round = randomRound({ cards: CARDS });

    const action$ = of(RoundAction.estimate({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());
    store.dispatch(RoundAction.notifyRoundUpdated(round));

    const ret = await firstValueFrom(epics.estimate(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("Can not give up with nullish"));
  });

  test("get changed round", async () => {
    const round = randomRound({ cards: CARDS });
    const user = User.create({ id: User.createId(), name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Round.takePlayerEstimation(round, user.id, UserEstimation.estimated(CARDS[1]));
    registrar.register(
      "estimatePlayerUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.resolves({ kind: "success", round: expected }),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(RoundAction.notifyRoundUpdated(expected));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.estimate({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.estimate(action$, state$, null));

    expect(ret).toEqual(RoundAction.estimateSuccess(expected));
  });

  test("should get error if index is invalid", async () => {
    const round = randomRound({ cards: CARDS });
    const game = randomGame({ round: round.id });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register("estimatePlayerUseCase", createMockedEstimatePlayerUseCase());

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(RoundAction.notifyRoundUpdated(round));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.estimate({ cardIndex: 5 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.estimate(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("specified card not found"));
  });

  test("should get error", async () => {
    const round = randomRound({ cards: CARDS });
    const game = randomGame({ round: round.id });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "estimatePlayerUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.rejects("error"),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(RoundAction.notifyRoundUpdated(round));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.estimate({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.estimate(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("failed with exception"));
  });
});

describe("show down", () => {
  test("handle event", async () => {
    let round = randomRound({ cards: CARDS });
    let [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    round = Round.takePlayerEstimation(round, game.owner, UserEstimation.giveUp());
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const fake = sinon.fake.resolves({ kind: "success", round: round });
    registrar.register(
      "showDownUseCase",
      createMockedShowDownUseCase({
        execute: fake,
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));
    store.dispatch(RoundAction.notifyRoundUpdated(round));

    const action$ = of(RoundAction.showDown());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.showDown(action$, state$, null));

    expect(ret).toEqual(RoundAction.showDownSuccess(round));
    expect(fake.callCount).toBe(1);
    expect(fake.lastCall.firstArg).toEqual({
      roundId: round.id,
    });
  });
});
