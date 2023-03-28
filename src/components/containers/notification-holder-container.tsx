import classNames from "classnames";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BaseProps, generateTestId } from "../base";
import { useAppSelector } from "../hooks";
import { NotificationMessage } from "../presentations/notification-message";
import { selectErrorMessages } from "@/status/selectors/error";

type Props = BaseProps;

const styles = {
  root: classNames(),
} as const;

// eslint-disable-next-line func-style
export function NotificationHolderContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const ref = useRef<HTMLElement>(document.createElement("div"));
  const messages = useAppSelector(selectErrorMessages);

  useEffect(() => {
    document.querySelector("#notification-holder")?.appendChild(ref.current);

    return () => {
      document.querySelector("#notification-holder")?.removeChild(ref.current);
    };
  }, []);

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
