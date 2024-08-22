import classNames from "classnames";
import { PropsWithChildren } from "react";
import { BaseProps, generateTestId } from "../base";

type NotificationType = "info" | "warning" | "alert";

export interface Props extends BaseProps {
  type?: NotificationType;
}

const styles = {
  root: (type: NotificationType) =>
    classNames(
      "list-none",
      "flex",
      "items-center",
      "w-48",
      "rounded",
      "border",
      "px-4",
      "py-3",
      "text-sm",
      "transition-[opacity,transform]",
      "animate-slide-in",
      {
        "border-primary-400": type === "info",
        "bg-primary-200/50": type === "info",
        "text-primary-500": type === "info",
      },
      {
        "border-secondary1-400": type === "warning",
        "bg-secondary1-200/50": type === "warning",
        "text-secondary1-500": type === "warning",
      },
      {
        "border-secondary2-400": type === "alert",
        "bg-secondary2-200/50": type === "alert",
        "text-secondary2-500": type === "alert",
      }
    ),
  content: classNames(),
} as const;

// eslint-disable-next-line func-style
export function NotificationMessage(props: PropsWithChildren<Props>) {
  const gen = generateTestId(props.testid);

  return (
    <li className={styles.root(props.type ?? "info")} data-testid={gen("root")}>
      <p className={styles.content} data-testid={gen("content")}>
        {props.children}
      </p>
    </li>
  );
}
