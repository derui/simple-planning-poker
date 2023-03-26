import classNames from "classnames";
import { useState } from "react";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";
import { KickableUserItem } from "./kickable-user-item";
import * as User from "@/domains/user";

export interface Props extends BaseProps {
  users: { name: string; id: User.Id }[];
  onKick?: (id: User.Id) => void;
}

const styles = {
  root: classNames("flex", "flex-col", "relative"),
  opener: (opened: boolean) =>
    classNames(
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
      "w-8",
      "h-8",
      "transition-colors",
      "before:transition-colors",
      iconize("users"),
      "active:shadow",
      {
        "before:bg-secondary1-400": !opened,
        "hover:bg-secondary1-400": !opened,
        "hover:before:bg-secondary1-200": !opened,
        "bg-secondary1-400": opened,
        "before:bg-secondary1-200": opened,
      }
    ),
  list: (opened: boolean) =>
    classNames(
      {
        invisible: !opened,
        "animate-fade-out": !opened,
      },
      {
        "animate-fade-in": opened,
      },
      "z-20",
      "absolute",
      "shadow-md",
      "w-72",
      "top-12",
      "[left:calc(-9rem_+_50%)]",
      "max-h-96",
      "border",
      "border-primary-400",
      "overflow-y-auto",
      "rounded",
      "p-3",
      "bg-white"
    ),
  tipArrow: (opened: boolean) =>
    classNames(
      {
        invisible: !opened,
        "animate-fade-out": !opened,
      },
      {
        "animate-fade-in": opened,
      },
      "absolute",
      "top-8",
      "before:relative",
      "before:inline-block",
      "before:-mt-8",
      "before:border-[16px]",
      "before:border-transparent",
      "before:border-b-primary-400"
    ),
} as const;

// eslint-disable-next-line func-style
export function JoinedUserList({ onKick, testid, users }: Props) {
  const gen = generateTestId(testid);
  const [opened, setOpened] = useState(false);

  const items = users.map((user, index) => {
    const _onKick = onKick ? () => onKick(user.id) : undefined;
    return <KickableUserItem key={index} name={user.name} onKick={_onKick} testid={gen(user.name)} />;
  });

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <button
        className={styles.opener(opened)}
        onClick={() => setOpened(!opened)}
        data-testid={gen("opener")}
        data-opened={opened}
      ></button>
      <span className={styles.tipArrow(opened)}></span>
      <ul className={styles.list(opened)} data-opened={opened} data-testid={gen("list")}>
        {items}
      </ul>
    </div>
  );
}
