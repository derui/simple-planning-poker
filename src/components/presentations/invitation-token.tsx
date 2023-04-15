import classNames from "classnames";
import React, { useEffect } from "react";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";

interface Props extends BaseProps {
  invitationToken: string;
  onCopy?: () => void;
}

const styles = {
  root: classNames("flex", "flex-col", "relative", "w-8", "h-8"),
  opener: (opened: boolean) =>
    classNames(
      "outline-none",
      "w-8",
      "h-8",
      "bg-none",
      "transition-[color,border-color,border-radius]",
      "before:transition-[color,border-color,border-radius]",
      "cursor-pointer",
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
      iconize("mail"),
      "active:shadow",
      {
        "before:bg-secondary1-400": !opened,
        "hover:bg-secondary1-400": !opened,
        "hover:before:bg-secondary1-200": !opened,
        "bg-secondary1-400": opened,
        "before:bg-secondary1-200": opened,
      }
    ),
  container: (opened: boolean) =>
    classNames(
      {
        invisible: !opened,
      },
      {
        "animate-fade-in": opened,
      },
      "z-20",
      "absolute",
      "flex",
      "top-12",
      "[transform:translateX(calc(-50%_+_1rem))]",
      "bg-white",
      "border",
      "border-secondary1-400",
      "pl-3",
      "pr-2",
      "py-2",
      "rounded",
      "shadow-md"
    ),

  tipArrow: (opened: boolean) =>
    classNames(
      {
        invisible: !opened,
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
      "before:border-b-secondary1-400"
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
    "outline-none",
    "px-3",
    "border",
    "border-l-0",
    "transition-colors",
    "border-secondary1-100",
    "hover:border-secondary1-500",
    "active:border-secondary1-500"
  ),
  copyButton: (copied: boolean) =>
    classNames(
      "flex",
      "items-center",
      "px-2",
      "outline-none",
      "border",
      "border-l-0",
      "border-secondary1-100",
      "hover:border-secondary1-400",
      "active:shadow",
      "transition-[shadow_colors]",
      iconize(copied ? "clipboard-check" : "clipboard"),
      "rounded-r",
      "before:bg-primary-400"
    ),
};

// eslint-disable-next-line func-style
export function InvitationToken(props: Props) {
  const gen = generateTestId(props.testid);
  const [opened, setOpened] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(id);
  }, [copied]);

  const onCopyButtonClick = () => {
    setCopied(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(props.invitationToken);
    }

    if (props.onCopy) {
      props.onCopy();
    }
  };

  return (
    <div className={styles.root} data-testid={gen("root")} data-opened={opened}>
      <button className={styles.opener(opened)} onClick={() => setOpened(!opened)} data-testid={gen("opener")}></button>
      <span className={styles.tipArrow(opened)}></span>
      <div className={styles.container(opened)} data-testid={gen("container")}>
        <div className={styles.item}>
          <span className={styles.label}>Invitation Token</span>
          <input className={styles.input} type="text" readOnly value={props.invitationToken} />
          <button
            onClick={onCopyButtonClick}
            className={styles.copyButton(copied)}
            data-testid={gen("copyButton")}
          ></button>
        </div>
      </div>
    </div>
  );
}
