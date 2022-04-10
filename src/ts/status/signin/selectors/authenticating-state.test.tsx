import { MutableSnapshot, RecoilRoot, useRecoilValue } from "recoil";
import authenticatingState from "./authenticating-state";
import { render } from "@testing-library/react";
import React from "react";
import { flushPromisesAndTimers } from "@/lib.test";
import signInState from "../atoms/signin-state";

test("user is not authenticating if state is default", async () => {
  const V = () => {
    const v = useRecoilValue(authenticatingState);

    expect(v).toEqual(false);

    return <></>;
  };

  render(
    <RecoilRoot>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();
});

test("get authenticating", async () => {
  const snapshot = ({ set }: MutableSnapshot) => {
    set(signInState, (prev) => ({ ...prev, authenticating: true }));
  };

  const V = () => {
    const v = useRecoilValue(authenticatingState);

    expect(v).toEqual(true);

    return <></>;
  };

  render(
    <RecoilRoot initializeState={snapshot}>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});
