import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  gameName: string;
  onLeaveGame: () => void;
}

const styles = {
  root: classNames("flex-none", "flex", "text-primary-500", "pr-2"),
  name: {
    contaienr: classNames("flex", "flex-auto", "align-stretch"),
    label: classNames("flex", "flex-none", "text-primary-300", "align-center"),
    name: classNames("flex", "flex-auto", "font-bold", "px-4", "py-3", "align-center"),
  },
  actions: {
    root: classNames("flex", "flex-none"),
    leave: classNames(
      "rounded-full",
      "border",
      "border-transparent",
      "bg-none",
      "transition-color",
      "transition-clip-path",
      "[clip-path:polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)]",
      "cursor-pointer",
      "hover:border-secondary2-400",
      "hover:bg-secondary2-200",
      "hover:[clip-path:polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)]",
      "before:w-3",
      "before:h-3",
      "before:inline-block",
      'before:bg-[url("/assets/svg/tabler-icons/opened-door-aperture.svg")]',
      'before:[mask-image:url("/assets/svg/tabler-icons/opened-door-aperture.svg")]',
      "before:bg-secondary2-500",
      "before:[mask-size:cover]",
      "before:align-middle",
      "after:inline-block",
      'after:content-["Leave"]',
      "after:text-secondary2-500",
      "after:relative",
      "after:right-[-10rem]",
      "after:align-middle",
      "after:transition-right",
      "after:mx-3",
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
        <button className={styles.actions.leave} onClick={() => onLeaveGame()}></button>
      </div>
    </main>
  );
}
