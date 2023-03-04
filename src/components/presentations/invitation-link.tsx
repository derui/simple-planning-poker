import classNames from "classnames";
import React from "react";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  invitationLink: string;
}

const styles = {
  root: classNames("flex", "flex-col", "relative", "mr-4", "w-8", "h-8"),
  opener: (opened: boolean) =>
    classNames(
      "outline-none",
      "p-2",
      "bg-none",
      "border-2",
      "transition-colors",
      "cursor-pointer",
      "w-8",
      "h-8",
      "rounded-full",
      "before:inline-block",
      "before: flex-none",
      'before:[mask-image:url("/assets/svg/tabler-icons/settings.svg")]',
      "before:[mask-size:cover]",
      "before:w-full",
      "before:h-full",
      "hover:border-secondary1-500",
      {
        "before:bg-secondary1-500": !opened,
        "border-transparent": !opened,
        "border-secondary1-500": opened,
        "bg-secondary1-500": opened,
        "rounded-b-none": opened,
        "before:bg-white": opened,
      }
    ),
  container: (opened: boolean) =>
    classNames("flex", "absolute", "top-8", "-right-2", "border", "border-secondary1-500", "px-3", "py-2", "rounded", {
      visible: opened,
      invisible: !opened,
    }),
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
    "pl-3",
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
