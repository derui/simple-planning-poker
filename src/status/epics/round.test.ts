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
import * as User from "@/domains/user";
import * as Cards from "@/domains/selectable-cards";
import * as SP from "@/domains/story-point";
import * as RoundAction from "@/status/actions/round";
import * as GameAction from "@/status/actions/game";
import * as UserEstimation from "@/domains/user-estimation";
import {
  createMockedChangeUserModeUseCase,
  createMockedEstimatePlayerUseCase,
  createMockedShowDownUseCase,
} from "@/test-lib";
import { UserMode } from "@/domains/game-player";

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
    const owner = User.create({ id: User.createId(), name: "name" });
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: owner.id,
      finishedRounds: [],
      cards: CARDS,
    });
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [owner] }));

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("Can not give up with nullish"));
  });

  test("get changed game", async () => {
    const user = User.create({ id: User.createId(), name: "foo" });
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: user.id,
      finishedRounds: [],
      cards: CARDS,
    });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.acceptPlayerHand(game, user.id, UserEstimation.giveUp());
    registrar.register(
      "handCardUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.giveUpSuccess(expected.round));
  });

  test("should get error", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "handCardUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.rejects("error"),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("failed with exception"));
  });
});

describe("hand card", () => {
  test("should error if game is not opened", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();

    const action$ = of(RoundAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("Can not give up with nullish"));
  });

  test("should error if user is not set", async () => {
    const user = User.create({ id: User.createId(), name: "name" });
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));

    const action$ = of(RoundAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("Can not give up with nullish"));
  });

  test("get changed game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.acceptPlayerHand(game, user.id, UserEstimation.estimated(CARDS[1]));
    registrar.register(
      "handCardUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(RoundAction.handCardSuccess(expected.round));
  });

  test("should get error if index is invalid", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register("handCardUseCase", createMockedEstimatePlayerUseCase());

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.handCard({ cardIndex: 5 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("specified card not found"));
  });

  test("should get error", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "handCardUseCase",
      createMockedEstimatePlayerUseCase({
        execute: sinon.fake.rejects("error"),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(RoundAction.somethingFailure("failed with exception"));
  });
});

describe("change user mode", () => {
  test("get mode changed", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.declarePlayerAs(game, user.id, UserMode.inspector);
    registrar.register(
      "changeUserModeUseCase",
      createMockedChangeUserModeUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(RoundAction.changeUserMode(UserMode.inspector));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.changeUserMode(action$, state$, null));

    expect(ret).toEqual(RoundAction.changeUserModeSuccess(expected.round));
  });
});

describe("show down", () => {
  test("create game", async () => {
    let [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    game = Game.acceptPlayerHand(game, game.owner, UserEstimation.giveUp());
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const fake = sinon.fake.resolves({ kind: "success", game: game });
    registrar.register(
      "showDownUseCase",
      createMockedShowDownUseCase({
        execute: fake,
      })
    );

    const epics = roundEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));
    store.dispatch(GameAction.openGameSuccess({ game, players: [] }));

    const action$ = of(RoundAction.showDown());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.showDown(action$, state$, null));

    expect(ret).toEqual(RoundAction.showDownSuccess(game.round));
    expect(fake.callCount).toBe(1);
    expect(fake.lastCall.firstArg).toEqual({
      gameId: game.id,
    });
  });
});
