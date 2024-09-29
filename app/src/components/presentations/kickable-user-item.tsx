import classNames from "classnames";
import { useState } from "react";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";
import { Skeleton } from "./skeleton";

export interface Props extends BaseProps {
  name: string;
  onKick?: () => void;
  loading?: boolean;
}

const styles = {
  item: {
    root: (loading: boolean) =>
      classNames(
        "rounded",
        "overflow-hidden",
        "list-none",
        "first-of-type:mt-0",
        "last-of-type:mb-0",
        "relative",
        "flex",
        "items-center",
        "my-2",
        "border",
        "border-primary-400",
        "h-12",
        "px-3",
        {
          "py-3": !loading,
        }
      ),
    name: classNames("flex-auto", "max-w-full", "overflow-hidden", "text-ellipsis"),
  },
  kickButton: {
    root: (confirming: boolean) =>
      classNames(
        "flex-none",
        "absolute",
        "right-0",
        "px-3",
        "flex",
        "overflow-hidden",
        "w-10",
        "items-center",
        "transition-[background-color,width]",
        "bg-secondary2-200",
        "h-full",
        {
          "w-28": confirming,
          "hover:w-24": !confirming,
        }
      ),
    kick: classNames(
      "rounded",
      "flex",
      "transition-colors",
      "text-secondary2-500",
      "before:transition-colors",
      "before:mr-2",
      "before:bg-secondary2-500",
      iconize("user-x"),
      "animate-fade-in"
    ),
    confirm: classNames(
      "rounded",
      "text-white",
      "text-sm",
      "mr-2",
      "animate-fade-in",
      "px-2",
      "py-1",
      "flex",
      "items-center",
      "bg-primary-500",
      "active:shadow",
      "before:bg-primary-200",
      iconize("check", { size: "s" })
    ),
    cancel: classNames(
      "rounded",
      "text-gray",
      "text-sm",
      "flex",
      "items-center",
      "animate-fade-in",
      "transition-colors",
      "border",
      "border-transparent",
      "hover:border-darkgray",
      "before:bg-gray",
      iconize("x", { size: "s" })
    ),
  },
} as const;

const KickButton = function KickButton({ onKick, testid }: { onKick: () => void; testid: string }) {
  const gen = generateTestId(testid);
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className={styles.kickButton.root(confirming)} data-testid={gen("root")}>
        <button
          className={styles.kickButton.confirm}
          data-testid={gen("confirm")}
          onClick={() => {
            setConfirming(false);
            onKick();
          }}
        >
          Yes
        </button>
        <button
          className={styles.kickButton.cancel}
          data-testid={gen("cancel")}
          onClick={() => {
            setConfirming(false);
          }}
        ></button>
      </span>
    );
  }

  return (
    <span className={styles.kickButton.root(confirming)} data-testid={gen("root")}>
      <button
        className={styles.kickButton.kick}
        data-testid={gen("main")}
        onClick={() => {
          setConfirming(true);
        }}
      >
        Kick
      </button>
    </span>
  );
};

// eslint-disable-next-line func-style
export function KickableUserItem(props: Props) {
  const gen = generateTestId(props.testid);

  const kick = props.onKick ? <KickButton onKick={props.onKick} testid={gen("kick")} /> : null;

  if (props.loading) {
    return (
      <li className={styles.item.root(props.loading || false)} data-testid={gen("root")}>
        <Skeleton testid={gen("skeleton")} />
      </li>
    );
  }

  return (
    <li className={styles.item.root(props.loading || false)} data-testid={gen("root")}>
      <span className={styles.item.name}>{props.name}</span>
      {kick}
    </li>
  );
}
