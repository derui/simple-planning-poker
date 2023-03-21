import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  gameName: string;
  onLeaveGame: () => void;
}

const styles = {
  root: classNames("flex-none", "flex", "text-primary-500", "pr-2", "justify-center"),
  name: {
    contaienr: classNames("flex", "flex-auto", "align-stretch", "items-center"),
    label: classNames("flex", "flex-none", "text-primary-300", "items-center"),
    name: classNames("flex", "flex-auto", "font-bold", "px-3", "py-2", "items-center"),
  },
  actions: {
    root: classNames("flex", "flex-none"),
    leave: classNames(
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
      "before:w-6",
      "before:h-6",
      "before:inline-block",
      "before:[mask-size:cover]",
      "before:[mask-repeat:no-repeat]",
      "before:[mask-position:center]",
      'before:[mask-image:url("/static/svg/tabler-icons/door-exit.svg")]',
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
};

// eslint-disable-next-line func-style
export function GameInfo({ gameName, onLeaveGame, testid }: Props) {
  const gen = generateTestId(testid);

  return (
    <main className={styles.root} data-testid={gen("root")}>
      <div className={styles.name.contaienr}>
        <span className={styles.name.label}>Now voting</span>
        <span className={styles.name.name}> {gameName}</span>
      </div>
      <div className={styles.actions.root}>
        <button className={styles.actions.leave} onClick={() => onLeaveGame()} data-testid={gen("leave")}></button>
      </div>
    </main>
  );
}
