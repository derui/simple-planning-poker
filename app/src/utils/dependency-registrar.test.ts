import { test, expect } from "vitest";
import { createDependencyRegistrar } from "./dependency-registrar";

test("can registrar any type and get any type with key", () => {
  type dep = {
    name: number;
    name2: string;
  };
  const registar = createDependencyRegistrar<dep>();

  registar.register("name", 5);
  registar.register("name2", "foo");

  const name = registar.resolve("name");
  const name2 = registar.resolve("name2");

  expect(name).toEqual(5);
  expect(name2).toEqual("foo");
});

test("throw error if not found", () => {
  type dep = {
    name: number;
  };
  const registar = createDependencyRegistrar<dep>();

  expect(() => registar.resolve("name")).toThrow();
});
