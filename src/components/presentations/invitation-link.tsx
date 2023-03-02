import classNames from "classnames";
import React from "react";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  invitationLink: string;
}

const styles = {
  root: classNames("flex", "flex-col", "relative", "mr-4"),
  opener: (opened: boolean) =>
    classNames(
      "outline-none",
      "p-2",
      "bg-none",
      "border-2",
      "transition-color",
      "cursor-pointer",
      "w-6",
      "h-6",
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
    classNames("flex", "absolute", "top-6", "right-0", "border-2", "border-secondary1-500", "p-4", {
      visible: opened,
      invisible: !opened,
    }),
  item: classNames("flex", "flex-auto"),
  label: classNames(
    "flex-none",
    "whitespace-nowrap",
    "text-center",
    "px-4",
    "py-3",
    "bg-secondary1-500",
    "text-secondary1-200"
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
          <input type="text" readOnly value={props.invitationLink} />
        </div>
      </div>
    </div>
  );
}
