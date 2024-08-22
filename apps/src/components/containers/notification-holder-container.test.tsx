import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { Provider } from "react-redux";
import { NotificationHolderContainer } from "./notification-holder-container";
import { createPureStore } from "@/status/store";
import { somethingFailure } from "@/status/actions/round";

afterEach(cleanup);

test("should be able to render", () => {
  render(
    <Provider store={createPureStore()}>
      <NotificationHolderContainer />
    </Provider>,
    {
      wrapper(props) {
        return (
          <>
            {props.children}
            <div id="notification-holder" />
          </>
        );
      },
    }
  );

  expect(screen.queryAllByTestId("message/root")).toHaveLength(0);
});

test("should render error messages", () => {
  const store = createPureStore();
  store.dispatch(somethingFailure({ reason: "failed message" }));

  render(
    <Provider store={store}>
      <NotificationHolderContainer />
    </Provider>,
    {
      wrapper(props) {
        return (
          <>
            {props.children}
            <div id="notification-holder" />
          </>
        );
      },
    }
  );

  const ret = screen.getAllByTestId("message/root");
  expect(ret).toHaveLength(1);
  expect(ret[0].textContent).toMatch(/failed message/);
});
