import { createUserId } from "@/domains/user";
import { MutableSnapshot, RecoilRoot } from "recoil";
import currentUserState from "../atoms/current-user";
import authenticatedSelector from "./authenticated";
import { render } from "@testing-library/react";
import { flushPromisesAndTimers } from "@/lib.test";
import React from "react";

test("user is not authenticated if state is default", async () => {
  const V = () => {
    const v = authenticatedSelector();

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

test("user is authenticated if user is setted", async () => {
  const snapshot = ({ set }: MutableSnapshot) => {
    set(currentUserState, (prev) => ({ ...prev, id: createUserId("1"), name: "name" }));
  };

  const V = () => {
    const v = authenticatedSelector();

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
