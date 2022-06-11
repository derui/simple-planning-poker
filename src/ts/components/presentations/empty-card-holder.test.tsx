import { cleanup, render, screen } from "solid-testing-library";
import EmptyCardHolder from "./empty-card-holder";

describe("Counter", () => {
  afterEach(cleanup);

  test("render empty holder", () => {
    render(() => <EmptyCardHolder />);
    const holder = screen.getByRole("contentinfo");
    expect(holder).toBeInTheDocument();
  });
});
