import { Dependencies } from "@/dependencies";
import { createId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { RecoilRoot } from "recoil";
import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import { createMockedGameRepository, flushPromisesAndTimers, RecoilObserver } from "@/test-lib";
import createUseApplyAuthenticated from "./use-apply-authenticated";
import currentUserState from "@/status/user/atoms/current-user-state";

test("call error callback if user is not found", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();

  const authenticator = {
    currentUserIdIfExists: jest.fn().mockImplementation(async () => undefined),
  };
  const userRepository = {
    findBy: jest.fn().mockImplementation(async () => undefined),
    save: jest.fn(),
  };

  registrar.register("authenticator", authenticator as any);
  registrar.register("userRepository", userRepository);
  registrar.register("gameRepository", createMockedGameRepository());

  const useHook = createUseApplyAuthenticated(registrar);
  const callback = jest.fn();
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook(() => {}, callback);
    });

    return <></>;
  };

  render(
    <RecoilRoot>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();

  expect(callback).toHaveBeenCalledTimes(1);
});

test("update state if user is found", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();

  const authenticator = {
    currentUserIdIfExists: jest.fn().mockImplementation(async () => createId("id")),
  };
  const userRepository = {
    findBy: jest.fn().mockImplementation(async () => ({ id: createId("id"), name: "name", joinedGames: [] })),
    save: jest.fn(),
  };
  const gameRepository = createMockedGameRepository();
  gameRepository.findBy.mockImplementation(async () => {});

  registrar.register("authenticator", authenticator as any);
  registrar.register("userRepository", userRepository);
  registrar.register("gameRepository", gameRepository);

  const useHook = createUseApplyAuthenticated(registrar);
  const callback = jest.fn();
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook(callback, () => {});
    });

    return <></>;
  };

  const onChange = jest.fn();

  render(
    <RecoilRoot>
      <RecoilObserver node={currentUserState} onChange={onChange} />
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();

  expect(callback).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ id: createId("id"), name: "name", joinedGames: [] });
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
