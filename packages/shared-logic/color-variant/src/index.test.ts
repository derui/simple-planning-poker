import { expect, test } from "vitest";
import { Variant } from "./index.js";

test("should get same name of enum", () => {
  expect(Variant.gray).toEqual("gray");
  expect(Variant.blue).toEqual("blue");
  expect(Variant.teal).toEqual("teal");
  expect(Variant.emerald).toEqual("emerald");
  expect(Variant.orange).toEqual("orange");
  expect(Variant.chestnut).toEqual("chestnut");
  expect(Variant.cerise).toEqual("cerise");
  expect(Variant.purple).toEqual("purple");
  expect(Variant.indigo).toEqual("indigo");
});
