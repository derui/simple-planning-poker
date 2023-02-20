// library for test. DO NOT USE ANY CLASS/FUNCTION IN THIS MODULE FROM PRODUCTION CODE!!

import { act } from "@testing-library/react";
import { useEffect } from "react";
import { RecoilValue, useRecoilValue } from "recoil";

export const createMockedDispatcher = () => {
  return {
    dispatch: jest.fn(),
  };
};

export const createMockedGameRepository = () => {
  return {
    save: jest.fn(),
    findBy: jest.fn(),
    findByInvitationSignature: jest.fn(),
  };
};

export const createMockedUserRepository = () => {
  return {
    save: jest.fn(),
    findBy: jest.fn(),
  };
};

export const createMockedGamePlayerRepository = () => {
  return {
    save: jest.fn(),
    findBy: jest.fn(),
    findByUserAndGame: jest.fn(),
    delete: jest.fn(),
  };
};

export const flushPromisesAndTimers = (): Promise<void> => {
  return act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, 100);
        jest.runAllTimers();
      })
  );
};

type Props<T> = {
  node: RecoilValue<T>;
  onChange: (v: T) => void;
};

export const RecoilObserver = <T>({ node, onChange }: Props<T>) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

// Avoid error
test("dummy", () => {});
