import type { MouseEvent } from "react";
import clsx from "clsx";

interface Props extends BaseProps {
  gameName: string;
  owner?: boolean;
  onLeaveGame?: () => void;
  onBack?: () => void;
}

const styles = {
  root: clsx("flex-none", "flex", "text-primary-500", "pr-2", "justify-center"),
  name: {
    container: clsx("flex", "flex-auto", "align-stretch", "items-center"),
    label: clsx("flex", "flex-none", "text-primary-300", "items-center"),
    name: clsx("flex", "flex-auto", "font-bold", "px-3", "py-2", "items-center"),
  },
  actions: {
    root: clsx("flex", "flex-none"),
    leave: clsx(
      "rounded-full",
      "border",
      "border-transparent",
      "bg-none",
      "transition-[background-color,color,clip-path]",
      "[clip-path:polygon(0%_0%,_40%_0%,_40%_100%,_0%_100%)]",
      "cursor-pointer",
      "hover:border-secondary2-400",
      "hover:bg-secondary2-200",
      "hover:[clip-path:polygon(0%_0%,_100%_0%,_100%_100%,_0%_100%)]",
      "before:ml-2",
      iconize("door-exit"),
      "before:bg-secondary2-500",
      "before:align-middle",
      "after:inline-block",
      'after:content-["Leave"]',
      "after:text-secondary2-500",
      "after:relative",
      "after:right-0",
      "after:align-middle",
      "after:transition-[right]",
      "after:mx-2",
      "hover:after:right-0"
    ),
  },

  backToTop: {
    root: clsx("flex", "mr-2"),
    container: clsx("flex", "items-center"),
    link: clsx(
      "flex",
      "items-center",
      "flex-auto",
      "rounded-full",
      "border",
      "border-transparent",
      "bg-none",
      "w-7",
      "h-7",
      "transition-colors",
      "before:transition-colors",
      "cursor-pointer",
      "hover:border-primary-400",
      "hover:before:bg-primary-500",
      "active:bg-primary-200",
      iconize("arrow-back-up"),
      "before:bg-primary-300",
      "before:align-middle"
    ),
  },
};

// eslint-disable-next-line func-style
export function GameInfo({ gameName, onLeaveGame, testid, owner, onBack }: Props) {
  const gen = generateTestId(testid);

  const leaveButton = !owner ? (
    <div className={styles.actions.root}>
      <button
        className={styles.actions.leave}
        onClick={() => {
          if (onLeaveGame) {
            onLeaveGame();
          }
        }}
        data-testid={gen("leave")}
      ></button>
    </div>
  ) : null;

  const handleBackClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (onBack) {
      onBack();
    }
  };

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <div className={styles.backToTop.root}>
        <span className={styles.backToTop.container} onClick={handleBackClick}>
          <span className={styles.backToTop.link} data-testid={gen("backToTop")}></span>
        </span>
      </div>
      <div className={styles.name.container}>
        <span className={styles.name.name}> {gameName}</span>
      </div>
      {leaveButton}
    </div>
  );
}
