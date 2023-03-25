import classNames from "classnames";
import React from "react";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";

interface Props extends BaseProps {
  invitationLink: string;
}

const styles = {
  root: classNames("flex", "flex-col", "relative", "w-8", "h-8"),
  opener: (opened: boolean) =>
    classNames(
      "outline-none",
      "w-8",
      "h-8",
      "bg-none",
      "transition-colors",
      "before:transition-colors",
      "cursor-pointer",
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
      iconize("mail"),
      {
        "before:bg-secondary1-400": !opened,
        "hover:bg-secondary1-400": !opened,
        "hover:before:bg-secondary1-200": !opened,
        "bg-secondary1-400": opened,
        "before:bg-secondary1-200": opened,
        "rounded-b-none": opened,
      }
    ),
  container: (opened: boolean) =>
    classNames(
      "flex",
      "absolute",
      "top-8",
      "-right-2",
      "bg-white",
      "border",
      "border-secondary1-500",
      "px-3",
      "py-2",
      "rounded",
      "shadow",
      {
        visible: opened,
        invisible: !opened,
      }
    ),
  item: classNames("flex", "flex-auto"),
  label: classNames(
    "rounded-l",
    "flex-none",
    "whitespace-nowrap",
    "text-center",
    "px-3",
    "py-2",
    "bg-secondary1-400",
    "text-secondary1-200"
  ),
  input: classNames(
    "rounded-r",
    "outline-none",
    "px-3",
    "border",
    "border-l-0",
    "transition-colors",
    "border-secondary1-100",
    "hover:border-secondary1-500",
    "active:border-secondary1-500"
  ),
};

// eslint-disable-next-line func-style
export function InvitationLink(props: Props) {
  const gen = generateTestId(props.testid);
  const [opened, setOpened] = React.useState(false);

  return (
    <div className={styles.root} data-testid={gen("root")} data-opened={opened}>
      <button className={styles.opener(opened)} onClick={() => setOpened(!opened)} data-testid={gen("opener")}></button>
      <div className={styles.container(opened)} data-testid={gen("container")}>
        <div className={styles.item}>
          <span className={styles.label}>Invitation Link</span>
          <input className={styles.input} type="text" readOnly value={props.invitationLink} />
        </div>
      </div>
    </div>
  );
}
