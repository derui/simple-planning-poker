import classNames from "classnames";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BaseProps, generateTestId } from "../base";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NotificationMessage } from "../presentations/notification-message";
import { selectErrorMessages } from "@/status/selectors/error";
import { clearError } from "@/status/actions/common";

type Props = BaseProps;

const styles = {
  root: classNames("space-y-3"),
} as const;

// eslint-disable-next-line func-style
export function NotificationHolderContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const ref = useRef<HTMLElement>(document.createElement("div"));
  const messages = useAppSelector(selectErrorMessages);
  const dispatch = useAppDispatch();

  ref.current.classList.add("absolute", "bottom-0");

  useEffect(() => {
    document.querySelector("#notification-holder")?.appendChild(ref.current);

    return () => {
      document.querySelector("#notification-holder")?.removeChild(ref.current);
    };
  }, []);

  useEffect(() => {
    messages.forEach((message) => {
      setTimeout(() => dispatch(clearError(message.id)), 5000);
    });
  }, [messages]);

  const elements = messages.map((message) => {
    return (
      <NotificationMessage key={message.id} type={message.type} testid={gen("message")}>
        {message.content}
      </NotificationMessage>
    );
  });

  return createPortal(
    <ul className={styles.root} data-testid={gen("holder")}>
      {elements}
    </ul>,
    ref.current
  );
}
