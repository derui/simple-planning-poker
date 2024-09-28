import { test, afterEach, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { CardHolder } from "./card-holder.js";
import { SelectableCard } from "./selectable-card.js";

afterEach(cleanup);

test("should be able to render", async () => {
  const ret = render(
    <CardHolder type="player">
      <SelectableCard>3</SelectableCard>
    </CardHolder>
  );

  expect(ret.container).toMatchSnapshot();
});

test("should be able to render as inspector", async () => {
  const ret = render(
    <CardHolder type="inspector">
      <SelectableCard>3</SelectableCard>
    </CardHolder>
  );

  expect(ret.container).toMatchSnapshot();
});
