import { expect, test, describe } from "vitest";
import { firstValueFrom, lastValueFrom, NEVER, of, take } from "rxjs";
import { StateObservable } from "redux-observable";
import sinon from "sinon";
import { createPureStore } from "../store";
import { signInSuccess } from "../actions/signin";
import { noopOnEpic } from "../actions/common";
import { gameEpic } from "./game";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as Cards from "@/domains/selectable-cards";
import * as SP from "@/domains/story-point";
import * as Round from "@/domains/round";
import * as GameAction from "@/status/actions/game";
import * as RoundAction from "@/status/actions/round";
import {
  createMockedChangeUserModeUseCase,
  createMockedCreateGameUseCase,
  createMockedGameObserver,
  createMockedGameRepository,
  createMockedJoinUserUseCase,
  createMockedLeaveGameUseCase,
  createMockedRoundObserver,
  createMockedUserObserver,
  createMockedUserRepository,
  randomRound,
} from "@/test-lib";
import { UserMode } from "@/domains/game-player";
import { NewRoundUseCase } from "@/usecases/new-round";

const CARDS = Cards.create([1, 2, 3].map(SP.create));

describe("leave game", () => {
  test("leave game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.declarePlayerAs(game, user.id, UserMode.inspector);
    registrar.register(
      "leaveGameUseCase",
      createMockedLeaveGameUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(GameAction.leaveGame());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.leaveGame(action$, state$, null));

    expect(ret).toEqual(GameAction.leaveGameSuccess());
  });
});
describe("join game", () => {
  test("join game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "joinUserUseCase",
      createMockedJoinUserUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: game }),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));

    const action$ = of(GameAction.joinGame(Game.makeInvitation(game)));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.joinGame(action$, state$, null));

    expect(ret).toEqual(GameAction.openGame(game.id));
  });
});

describe("open game", () => {
  test("open game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register("userRepository", createMockedUserRepository({ listIn: sinon.fake.resolves([user]) }));
    registrar.register(
      "gameRepository",
      createMockedGameRepository({
        findBy: sinon.fake.resolves(game),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));

    const action$ = of(GameAction.openGame(game.id));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.openGame(action$, state$, null));

    expect(ret).toEqual(GameAction.openGameSuccess({ game, players: [user] }));
  });
});

describe("create game", () => {
  test("create game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const fake = sinon.fake.resolves({ kind: "success", game: game });
    registrar.register(
      "createGameUseCase",
      createMockedCreateGameUseCase({
        execute: fake,
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));

    const action$ = of(GameAction.createGame({ name: "foo", points: [1] }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.createGame(action$, state$, null));

    expect(ret).toEqual(GameAction.createGameSuccess(game));
    expect(fake.callCount).toBe(1);
    expect(fake.lastCall.firstArg).toEqual({
      name: "foo",
      points: [1],
      createdBy: user.id,
    });
  });
});

describe("observe game", () => {
  test("get noop if any changes does not comes from observer", async () => {
    let [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register("roundObserver", createMockedRoundObserver());
    registrar.register("userObserver", createMockedUserObserver());
    registrar.register("gameObserver", {
      subscribe() {},
      unsubscribe() {},
    });

    const epics = gameEpic(registrar);
    const store = createPureStore();

    const action$ = of(GameAction.openGameSuccess({ game, players: [] }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.observeOpenedGame(action$, state$, null));

    expect(ret).toEqual(noopOnEpic());
  });

  test("notify game change", async () => {
    let [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register("userObserver", createMockedUserObserver());
    registrar.register("roundObserver", createMockedRoundObserver());
    registrar.register("gameObserver", {
      subscribe(_id, _callback) {
        _callback(game);
      },
      unsubscribe() {},
    });

    const epics = gameEpic(registrar);
    const store = createPureStore();

    const action$ = of(GameAction.openGameSuccess({ game, players: [] }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await lastValueFrom(epics.observeOpenedGame(action$, state$, null).pipe(take(2)));

    expect(ret).toEqual(GameAction.notifyGameChanges(game));
  });

  test("notify round change", async () => {
    const round = randomRound({ cards: CARDS });
    let [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: round.id,
    });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register("userObserver", createMockedUserObserver());
    registrar.register("gameObserver", createMockedGameObserver());
    registrar.register("roundObserver", {
      subscribe(_id, _callback) {
        _callback(round);
      },
      unsubscribe() {},
    });

    const epics = gameEpic(registrar);
    const store = createPureStore();

    const action$ = of(GameAction.openGameSuccess({ game, players: [] }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await lastValueFrom(epics.observeOpenedGame(action$, state$, null).pipe(take(2)));

    expect(ret).toEqual(RoundAction.notifyRoundUpdated(round));
  });
});

describe("new round", () => {
  test("new round", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
      round: Round.createId(),
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const fake = sinon.fake.resolves({ kind: "success", game: game });
    registrar.register("newRoundUseCase", {
      execute: fake as any,
    } as NewRoundUseCase);

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(signInSuccess({ user }));
    store.dispatch(GameAction.openGameSuccess({ game, players: [] }));

    const action$ = of(GameAction.newRound());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.newRound(action$, state$, null));

    expect(ret.type).toEqual(GameAction.newRoundSuccess.type);
    expect(fake.callCount).toBe(1);
    expect(fake.lastCall.firstArg).toEqual({
      gameId: game.id,
    });
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
      round: Round.createId(),
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

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess({ game, players: [user] }));
    store.dispatch(signInSuccess({ user }));

    const action$ = of(GameAction.changeUserMode(UserMode.inspector));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.changeUserMode(action$, state$, null));

    expect(ret).toEqual(GameAction.changeUserModeSuccess(expected));
  });
});
