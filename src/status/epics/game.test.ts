import { expect, test, describe } from "vitest";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as Cards from "@/domains/selectable-cards";
import * as SP from "@/domains/story-point";
import * as GameAction from "@/status/actions/game";
import * as UserHand from "@/domains/user-hand";
import { firstValueFrom, NEVER, of } from "rxjs";
import { createPureStore } from "../store";
import { StateObservable } from "redux-observable";
import { gameEpic } from "./game";
import { signInSuccess } from "../actions/signin";
import {
  createMockedChangeUserModeUseCase,
  createMockedGameRepository,
  createMockedHandCardUseCase,
  createMockedJoinUserUseCase,
  createMockedLeaveGameUseCase,
} from "@/test-lib";
import sinon from "sinon";
import { UserMode } from "@/domains/game-player";

const CARDS = Cards.create([1, 2, 3].map(SP.create));

describe("giveUp", () => {
  test("should error if game is not opened", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = gameEpic(registrar);
    const store = createPureStore();

    const action$ = of(GameAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(GameAction.somethingFailure("Can not give up with nullish"));
  });

  test("should error if user is not set", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));

    const action$ = of(GameAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(GameAction.somethingFailure("Can not give up with nullish"));
  });

  test("get changed game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.acceptPlayerHand(game, user.id, UserHand.giveUp());
    registrar.register(
      "handCardUseCase",
      createMockedHandCardUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(GameAction.giveUpSuccess(expected));
  });

  test("should get error", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "handCardUseCase",
      createMockedHandCardUseCase({
        execute: sinon.fake.rejects("error"),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.giveUp());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.giveUp(action$, state$, null));

    expect(ret).toEqual(GameAction.somethingFailure("failed with exception"));
  });
});

describe("hand card", () => {
  test("should error if game is not opened", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = gameEpic(registrar);
    const store = createPureStore();

    const action$ = of(GameAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(GameAction.somethingFailure("Can not give up with nullish"));
  });

  test("should error if user is not set", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));

    const action$ = of(GameAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(GameAction.somethingFailure("Can not give up with nullish"));
  });

  test("get changed game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.acceptPlayerHand(game, user.id, UserHand.handed(CARDS[1]));
    registrar.register(
      "handCardUseCase",
      createMockedHandCardUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(GameAction.handCardSuccess(expected));
  });

  test("should get error if index is invalid", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register("handCardUseCase", createMockedHandCardUseCase());

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.handCard({ cardIndex: 5 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(GameAction.somethingFailure("specified card not found"));
  });

  test("should get error", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "handCardUseCase",
      createMockedHandCardUseCase({
        execute: sinon.fake.rejects("error"),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.handCard({ cardIndex: 1 }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.handCard(action$, state$, null));

    expect(ret).toEqual(GameAction.somethingFailure("failed with exception"));
  });
});

describe("change user mode", () => {
  test("get mode changed", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.declarePlayerTo(game, user.id, UserMode.inspector);
    registrar.register(
      "changeUserModeUseCase",
      createMockedChangeUserModeUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.changeUserMode(UserMode.inspector));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.changeUserMode(action$, state$, null));

    expect(ret).toEqual(GameAction.changeUserModeSuccess(expected));
  });
});

describe("leave game", () => {
  test("leave game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    const expected = Game.declarePlayerTo(game, user.id, UserMode.inspector);
    registrar.register(
      "leaveGameUseCase",
      createMockedLeaveGameUseCase({
        execute: sinon.fake.resolves({ kind: "success", game: expected }),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

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
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
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
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.joinGame(Game.makeInvitation(game)));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.joinGame(action$, state$, null));

    expect(ret).toEqual(GameAction.joinGameSuccess(game));
  });
});

describe("open game", () => {
  test("open game", async () => {
    const [game] = Game.create({
      id: Game.createId(),
      name: "name",
      joinedPlayers: [],
      owner: User.createId(),
      finishedRounds: [],
      cards: CARDS,
    });
    const user = User.create({ id: game.owner, name: "foo" });
    const registrar = createDependencyRegistrar<Dependencies>();

    registrar.register(
      "gameRepository",
      createMockedGameRepository({
        findBy: sinon.fake.resolves(game),
      })
    );

    const epics = gameEpic(registrar);
    const store = createPureStore();
    store.dispatch(GameAction.openGameSuccess(game));
    store.dispatch(signInSuccess(user));

    const action$ = of(GameAction.openGame(game.id));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.openGame(action$, state$, null));

    expect(ret).toEqual(GameAction.openGameSuccess(game));
  });
});
