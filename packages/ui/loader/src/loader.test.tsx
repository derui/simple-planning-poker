import { test, afterEach, expect } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { Loader } from "./loader.js";

afterEach(cleanup);

test("should be able to render", async () => {
  render(<Loader size="s" shown={false} />);

  const ret = screen.queryByRole("alert");

  expect(ret).not.toBeNull();
  expect(ret?.dataset).toHaveProperty("shown", "false");
});

test("display loader", async () => {
  render(<Loader size="s" shown={true} />);

  const ret = screen.queryByRole("alert");

  expect(ret).not.toBeNull();
  expect(ret?.dataset).toHaveProperty("shown", "true");
});
