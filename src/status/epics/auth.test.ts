import { test, expect, describe } from "vitest";
import { firstValueFrom, lastValueFrom, NEVER, of, take } from "rxjs";
import { StateObservable } from "redux-observable";
import sinon from "sinon";
import { createPureStore } from "../store";
import { noopOnEpic } from "../actions/common";
import { notifyOtherUserChanged } from "../actions/user";
import { authEpic } from "./auth";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as SignInAction from "@/status/actions/signin";
import {
  createMockedAuthenticator,
  createMockedGameRepository,
  createMockedUserObserver,
  createMockedUserRepository,
} from "@/test-lib";

describe("try authenticate", () => {
  test("get current user if exists", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = authEpic(registrar);
    const store = createPureStore();

    const user = User.create({ id: User.createId(), name: "user" });

    registrar.register(
      "authenticator",
      createMockedAuthenticator({
        currentUserIdIfExists: sinon.fake.resolves(user.id),
      })
    );
    registrar.register(
      "userRepository",
      createMockedUserRepository({
        findBy: sinon.fake.resolves(user),
      })
    );
    registrar.register(
      "gameRepository",
      createMockedGameRepository({
        listUserJoined: sinon.fake.resolves([{ id: Game.createId("key"), name: "name" }]),
      })
    );

    const action$ = of(SignInAction.tryAuthenticate());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.tryAuthenticate(action$, state$, null));

    expect(ret).toEqual(SignInAction.tryAuthenticateSuccess({ user, joinedGames: { [Game.createId("key")]: "name" } }));
  });

  test("should fail if already authenticated", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = authEpic(registrar);
    const store = createPureStore();

    const user = User.create({ id: User.createId(), name: "user" });

    store.dispatch(SignInAction.signInSuccess({ user, joinedGames: {} }));
    registrar.register(
      "authenticator",
      createMockedAuthenticator({
        currentUserIdIfExists: sinon.fake.resolves(user.id),
      })
    );
    registrar.register(
      "userRepository",
      createMockedUserRepository({
        findBy: sinon.fake.resolves(user),
      })
    );
    registrar.register("gameRepository", createMockedGameRepository());

    const action$ = of(SignInAction.tryAuthenticate());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.tryAuthenticate(action$, state$, null));

    expect(ret).toEqual(SignInAction.tryAuthenticateFailure());
  });
});

describe("sign in", () => {
  test("get user with sign up", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = authEpic(registrar);
    const store = createPureStore();

    const user = User.create({ id: User.createId(), name: "user" });

    const signIn = sinon.fake.resolves(user.id);
    registrar.register(
      "authenticator",
      createMockedAuthenticator({
        signIn,
      })
    );
    registrar.register(
      "userRepository",
      createMockedUserRepository({
        findBy: sinon.fake.resolves(user),
      })
    );
    registrar.register("gameRepository", createMockedGameRepository());

    const action$ = of(SignInAction.signIn({ email: "email", password: "password" }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.signIn(action$, state$, null));

    expect(ret).toEqual(SignInAction.signInSuccess({ user, joinedGames: {} }));
    expect(signIn.lastCall.firstArg).toBe("email");
    expect(signIn.lastCall.args[1]).toBe("password");
  });
});

describe("sign up", () => {
  test("get user with sign in", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = authEpic(registrar);
    const store = createPureStore();

    const user = User.create({ id: User.createId(), name: "user" });

    const signUp = sinon.fake.resolves(user.id);
    registrar.register(
      "authenticator",
      createMockedAuthenticator({
        signUp,
      })
    );
    registrar.register(
      "userRepository",
      createMockedUserRepository({
        findBy: sinon.fake.resolves(user),
      })
    );

    registrar.register("gameRepository", createMockedGameRepository());

    const action$ = of(SignInAction.signUp({ email: "email", password: "password" }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.signUp(action$, state$, null));

    expect(ret).toEqual(SignInAction.signUpSuccess({ user, joinedGames: {} }));
    expect(signUp.lastCall.firstArg).toBe("email");
    expect(signUp.lastCall.args[1]).toBe("email");
    expect(signUp.lastCall.args[2]).toBe("password");
  });
});

describe("observe user after tryAuthenticate", () => {
  test("get noop when no value from subscription", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = authEpic(registrar);
    const store = createPureStore();

    const user = User.create({ id: User.createId(), name: "user" });

    const currentUserIdIfExists = sinon.fake.resolves(user.id);
    registrar.register(
      "authenticator",
      createMockedAuthenticator({
        currentUserIdIfExists: currentUserIdIfExists,
      })
    );
    const subscribe = sinon.fake();
    registrar.register("userObserver", createMockedUserObserver({ subscribe }));
    registrar.register(
      "userRepository",
      createMockedUserRepository({
        findBy: sinon.fake.resolves(user),
      })
    );

    registrar.register("gameRepository", createMockedGameRepository());

    const action$ = of(SignInAction.tryAuthenticateSuccess({ user, joinedGames: {} }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.observeUserAfterTryAuthenticate(action$, state$, null).pipe(take(1)));

    expect(ret).toEqual(noopOnEpic());
    expect(subscribe.lastCall.firstArg).toBe(user.id);
  });

  test("notify user when observer call callback", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = authEpic(registrar);
    const store = createPureStore();

    const user = User.create({ id: User.createId(), name: "user" });

    const currentUserIdIfExists = sinon.fake.resolves(user.id);
    registrar.register(
      "authenticator",
      createMockedAuthenticator({
        currentUserIdIfExists: currentUserIdIfExists,
      })
    );

    const changed = User.changeName(user, "changed")[0];
    const observer = {
      subscribe(_id: any, callback: any) {
        callback(changed);

        return () => {};
      },
    };
    registrar.register("userObserver", observer);
    registrar.register(
      "userRepository",
      createMockedUserRepository({
        findBy: sinon.fake.resolves(user),
      })
    );

    registrar.register("gameRepository", createMockedGameRepository());

    const action$ = of(SignInAction.tryAuthenticateSuccess({ user, joinedGames: {} }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret$ = epics.observeUserAfterTryAuthenticate(action$, state$, null).pipe(take(2));
    const ret = await lastValueFrom(ret$);

    expect(ret).toEqual(notifyOtherUserChanged(changed));
  });
});
