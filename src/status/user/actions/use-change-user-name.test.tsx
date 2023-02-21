import { Dependencies } from "@/dependencies";
import { createUserId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { MutableSnapshot, RecoilRoot } from "recoil";
import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import { flushPromisesAndTimers, RecoilObserver } from "@/test-lib";
import createUseChangeUserName from "./use-change-user-name";
import currentUserState from "../atoms/current-user-state";

test("do not execute use case if not logged in", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();

  const useCase = {
    execute: jest.fn().mockImplementation(async () => undefined),
  };

  registrar.register("changeUserNameUseCase", useCase as any);

  const useHook = createUseChangeUserName(registrar);
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook("name");
    });

    return <></>;
  };

  render(
    <RecoilRoot>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();

  expect(useCase.execute).toHaveBeenCalledTimes(0);
});

test("execute use case and update state", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();

  const useCase = {
    execute: jest.fn().mockImplementation(async () => undefined),
  };

  registrar.register("changeUserNameUseCase", useCase as any);

  const useHook = createUseChangeUserName(registrar);
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook("name");
    }, []);

    return <></>;
  };

  const currentUser = { id: createUserId("id"), name: "", joinedGames: [] };
  const initialize = (s: MutableSnapshot) => {
    s.set(currentUserState, currentUser);
  };
  const onChange = jest.fn();

  render(
    <RecoilRoot initializeState={initialize}>
      <RecoilObserver node={currentUserState} onChange={onChange} />
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();

  expect(useCase.execute).toHaveBeenCalledTimes(1);
  expect(useCase.execute).toHaveBeenCalledWith({ userId: createUserId("id"), name: "name" });
  expect(onChange).toHaveBeenCalledWith({ ...currentUser, name: "name" });
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
