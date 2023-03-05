import { test, expect } from "vitest";
import { StateObservable } from "redux-observable";
import { firstValueFrom, NEVER, of } from "rxjs";
import sinon from "sinon";
import { createPureStore } from "../store";
import { signInSuccess } from "../actions/signin";
import * as epic from "./user";
import * as User from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import * as UserAction from "@/status/actions/user";

import { createMockedChangeUserNameUseCase } from "@/test-lib";

test("should get user changed name", async () => {
  expect.assertions(1);
  const registrar = createDependencyRegistrar<Dependencies>();
  const user = User.create({ id: User.createId(), name: "foo" });

  const store = createPureStore();
  store.dispatch(signInSuccess({ user }));

  const action$ = of(UserAction.changeName("changed"));

  registrar.register(
    "changeUserNameUseCase",
    createMockedChangeUserNameUseCase({
      execute: sinon.fake.resolves({ kind: "success", user: User.changeName(user, "changed")[0] }),
    })
  );

  const epics = epic.userEpic(registrar);

  const state$ = new StateObservable(NEVER, store.getState());

  const ret = await firstValueFrom(epics.changeUserName(action$, state$, null));

  expect(ret).toEqual(UserAction.changeNameSuccess(User.changeName(user, "changed")[0]));
});

test("should fail if current user not defined", async () => {
  expect.assertions(1);
  const registrar = createDependencyRegistrar<Dependencies>();

  const store = createPureStore();

  const action$ = of(UserAction.changeName("changed"));

  registrar.register("changeUserNameUseCase", createMockedChangeUserNameUseCase());

  const epics = epic.userEpic(registrar);

  const state$ = new StateObservable(NEVER, store.getState());

  const ret = await firstValueFrom(epics.changeUserName(action$, state$, null));

  expect(ret).toEqual(UserAction.changeNameFailure());
});

test("should fail if use case failed", async () => {
  expect.assertions(1);
  const registrar = createDependencyRegistrar<Dependencies>();

  const user = User.create({ id: User.createId(), name: "foo" });

  const store = createPureStore();
  store.dispatch(signInSuccess({ user }));

  const action$ = of(UserAction.changeName("changed"));

  registrar.register(
    "changeUserNameUseCase",
    createMockedChangeUserNameUseCase({
      execute: sinon.fake.resolves({ kind: "notFound" }),
    })
  );

  const epics = epic.userEpic(registrar);

  const state$ = new StateObservable(NEVER, store.getState());

  const ret = await firstValueFrom(epics.changeUserName(action$, state$, null));

  expect(ret).toEqual(UserAction.changeNameFailure());
});

test("should fail if error occurred", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();

  const user = User.create({ id: User.createId(), name: "foo" });

  const store = createPureStore();
  store.dispatch(signInSuccess({ user }));

  const action$ = of(UserAction.changeName("changed"));

  registrar.register(
    "changeUserNameUseCase",
    createMockedChangeUserNameUseCase({
      execute: sinon.fake.rejects("error"),
    })
  );

  const epics = epic.userEpic(registrar);

  const state$ = new StateObservable(NEVER, store.getState());

  const ret = await firstValueFrom(epics.changeUserName(action$, state$, null));
  expect(ret).toEqual(UserAction.changeNameFailure());
});
