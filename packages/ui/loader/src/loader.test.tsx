import { test, afterEach, expect } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { Loader } from "./loader.js";
import { Variant } from "@spp/shared-color-variant";

afterEach(cleanup);

test("should be able to render", () => {
  render(<Loader size="s" shown={false} />);

  const ret = screen.queryByRole("alert");

  expect(ret).not.toBeNull();
  expect(ret?.dataset).toHaveProperty("shown", "false");
});

test("display loader", () => {
  render(<Loader size="s" shown={true} />);

  const ret = screen.queryByRole("alert");

  expect(ret).not.toBeNull();
  expect(ret?.dataset).toHaveProperty("shown", "true");
});

test("display loader with variant", () => {
  const ret = render(<Loader size="s" shown={true} variant={Variant.cerise} />);

  expect(ret.container).toMatchSnapshot();
});
