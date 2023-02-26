import { test, expect, describe } from "vitest";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import * as User from "@/domains/user";
import { authEpic } from "./auth";
import { createPureStore } from "../store";
import * as SignInAction from "@/status/actions/signin";
import { firstValueFrom, NEVER, of } from "rxjs";
import { StateObservable } from "redux-observable";
import { createMockedAuthenticator, createMockedUserRepository } from "@/test-lib";
import sinon from "sinon";

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

    const action$ = of(SignInAction.tryAuthenticate());
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.tryAuthenticate(action$, state$, null));

    expect(ret).toEqual(SignInAction.tryAuthenticateSuccess(user));
  });

  test("should fail if already authenticated", async () => {
    const registrar = createDependencyRegistrar<Dependencies>();
    const epics = authEpic(registrar);
    const store = createPureStore();

    const user = User.create({ id: User.createId(), name: "user" });

    store.dispatch(SignInAction.signInSuccess(user));
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

    const action$ = of(SignInAction.signIn({ email: "email", password: "password" }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.signIn(action$, state$, null));

    expect(ret).toEqual(SignInAction.signInSuccess(user));
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

    const action$ = of(SignInAction.signUp({ email: "email", password: "password" }));
    const state$ = new StateObservable(NEVER, store.getState());

    const ret = await firstValueFrom(epics.signUp(action$, state$, null));

    expect(ret).toEqual(SignInAction.signUpSuccess(user));
    expect(signUp.lastCall.firstArg).toBe("email");
    expect(signUp.lastCall.args[1]).toBe("email");
    expect(signUp.lastCall.args[2]).toBe("password");
  });
});
