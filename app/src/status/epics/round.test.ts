import { expect, test, describe } from "vitest";
import { firstValueFrom, NEVER, of } from "rxjs";
import { StateObservable } from "redux-observable";
import sinon from "sinon";
import { createPureStore } from "../store";
import { signInSuccess } from "../actions/signin";
import { fromFinishedRound } from "../query-models/round-history";
import { roundEpic } from "./round";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import * as Cards from "@/domains/selectable-cards";
import * as SP from "@/domains/story-point";
import * as RoundAction from "@/status/actions/round";
import * as GameAction from "@/status/actions/game";
import * as UserEstimation from "@/domains/user-estimation";
import {
  createMockedEstimatePlayerUseCase,
  createMockedRoundHistoryRepository,
  createMockedRoundRepository,
  createMockedShowDownUseCase,
  createMockedUseCase,
  randomFinishedRound,
  randomGame,
  randomRound,
} from "@/test-lib";
import { ChangeThemeUseCase } from "@/usecases/change-theme";
import { between } from "@/utils/array";

const CARDS = Cards.create([1, 2, 3].map(SP.create));

describe("giveUp", () => {
  test("should error if game is not opened", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure({ reason: "Can not give up" }));
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

    expect(ret).toEqual(RoundAction.somethingFailure({ reason: "Can not give up" }));
  });

  test("get changed game", async () => {
    const user = User.create({ id: User.createId(), name: "foo" });
    const round = randomRound({ cards: CARDS });
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

    expect(ret).toEqual(RoundAction.somethingFailure({ reason: "failed with exception" }));
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

    expect(ret).toEqual(RoundAction.somethingFailure({ reason: "Can not estimate" }));
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

    expect(ret).toEqual(RoundAction.somethingFailure({ reason: "Can not estimate" }));
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

    expect(ret).toEqual(RoundAction.somethingFailure({ reason: "Selected card is not valid" }));
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

    expect(ret).toEqual(RoundAction.somethingFailure({ reason: "failed with exception" }));
  });
});

describe("show down", () => {
  test("handle event", async () => {
    let round = randomRound({ cards: CARDS });
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
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

describe("change theme", () => {
  test("handle event", async () => {
    let round = randomRound({ cards: CARDS });
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      cards: CARDS,
      round: Round.createId(),
    });
    round = Round.takePlayerEstimation(round, game.owner, UserEstimation.giveUp());
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const fake = sinon.fake.resolves({ kind: "success", round: round });
    registrar.register(
      "changeThemeUseCase",
      createMockedUseCase<ChangeThemeUseCase>({
        execute: fake,
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));
    store.dispatch(RoundAction.notifyRoundUpdated(round));

    const action$ = of(RoundAction.changeTheme("theme"));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.changeTheme(action$, state$, null));

    expect(ret).toEqual(RoundAction.changeThemeSuccess(round));
    expect(fake.callCount).toBe(1);
    expect(fake.lastCall.firstArg).toEqual({
      roundId: round.id,
      theme: "theme",
    });
  });
});

describe("finished rounds", () => {
  test("open finished rounds", async () => {
    const round = randomFinishedRound({ cards: CARDS });
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const fake = sinon.fake.resolves({ result: [fromFinishedRound(round)], key: "key" });
    registrar.register(
      "roundHistoryQuery",
      createMockedRoundHistoryRepository({
        listBy: fake,
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));
    store.dispatch(GameAction.openGameSuccess({ game, players: [] }));
    store.dispatch(RoundAction.notifyRoundUpdated(round));

    const action$ = of(RoundAction.openRoundHistories());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.openRoundHistories(action$, state$, null));

    expect(ret).toEqual(RoundAction.openRoundHistoriesSuccess({ rounds: [fromFinishedRound(round)], lastKey: "key" }));
    expect(fake.callCount).toBe(1);
    expect(fake.lastCall.args).toEqual([game.id, { count: 10 }]);
  });

  test("change page of finished rounds", async () => {
    const rounds: Round.FinishedRound[] = [];
    between(0, 15).forEach((v) => {
      rounds.push(randomFinishedRound({ theme: `theme${v}` }));
    });

    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "roundHistoryQuery",
      createMockedRoundHistoryRepository({
        listBy: sinon.fake.resolves({ result: rounds.slice(10).map(fromFinishedRound), key: "key" }),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));
    store.dispatch(GameAction.openGameSuccess({ game, players: [] }));

    const action$ = of(RoundAction.nextPageOfRoundHistories());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.nextPageOfRoundHistories(action$, state$, null));

    expect(ret).toEqual(
      RoundAction.nextPageOfRoundHistoriesSuccess({ rounds: rounds.slice(10).map(fromFinishedRound), lastKey: "key" })
    );
  });
});

describe("round history", () => {
  test("open round history", async () => {
    const round = randomFinishedRound({ cards: CARDS });
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const fake = sinon.fake.resolves(round);
    registrar.register(
      "roundRepository",
      createMockedRoundRepository({
        findFinishedRoundBy: fake,
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));
    store.dispatch(GameAction.openGameSuccess({ game, players: [] }));

    const action$ = of(RoundAction.openRoundHistory(round.id));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.openRoundHistory(action$, state$, null));

    expect(ret).toEqual(RoundAction.openRoundHistorySuccess(round));
    expect(fake.callCount).toBe(1);
    expect(fake.lastCall.args).toEqual([round.id]);
  });
});
