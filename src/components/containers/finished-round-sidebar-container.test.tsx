import { test, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

import { FinishedRoundSidebarContainer } from "./finished-round-sidebar-container";

afterEach(cleanup);

test("should be able to render", () => {
  render(<FinishedRoundSidebarContainer />);
});
