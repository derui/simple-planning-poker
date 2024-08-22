import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { NotificationMessage } from "./notification-message";

afterEach(cleanup);

test("should be able to render", () => {
  render(<NotificationMessage>Notification message</NotificationMessage>);

  expect(screen.queryByText("Notification message")).not.toBeNull();
});
