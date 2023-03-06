import classNames from "classnames";
import { PlayerHands } from "../presentations/player-hands";
import { BaseProps } from "../base";
import { useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { UserMode } from "@/domains/game-player";
import { selectUserHandInfos, UserHandInfo } from "@/status/selectors/user-hand";
import { isFinished } from "@/utils/loadable";

interface Props extends BaseProps {
  onNewGame: () => void;
  userMode: UserMode;
  hands: UserHandInfo[];
}

const styles = {
  root: classNames("relative", "w-full", "h-full"),
  gridContainer: classNames(
    "w-full",
    "h-full",
    "grid",
    "grid-rows-[1fr_h-36_h-24_h-36_1fr]",
    "grid-cols-[1fr_max-content_1fr]"
  ),
  hands: classNames("flex"),
  table: classNames(
    "flex",
    "rounded-full",
    "border-2",
    "border-primary-400",
    "bg-secondary1-300",
    "h-20",
    "min-w-64",
    "flex-col",
    "items-center",
    "justify-center"
  ),
  nextGameButton: classNames(
    "flex-none",
    "outline-none",
    "border",
    "border-prinary-500",
    "rounded",
    "bg-primary-200",
    "text-primary-500",
    "px-3",
    "py-2",
    "transition-all",
    "active:shadow",
    "hover:text-primary-200",
    "hover:bg-primary-500"
  ),
};

const GameProgressionButton = (props: Props) => {
  const { onNewGame } = props;

  return (
    <button className={styles.nextGameButton} onClick={() => onNewGame()}>
      Start next game
    </button>
  );
};

// eslint-disable-next-line func-style
export function GameArea(props: Props) {
  const hands = useAppSelector(selectUserHandInfos());

  if (!isFinished(hands)) {
    return (
      <div className={styles.root}>
        <div className={styles.gridContainer}>
          <div></div>
          <Skeleton />
          <div className={styles.table}>
            <Skeleton />
          </div>
          <Skeleton />
          <div></div>
        </div>
      </div>
    );
  }

  const button = GameProgressionButton(props);
  const upper = hands[0].filter((_, index) => index / 2 === 0);
  const lower = hands[0].filter((_, index) => index / 2 === 1);

  return (
    <div className={styles.root}>
      <div className={styles.gridContainer}>
        <div></div>
        <PlayerHands hands={upper} />
        <div className={styles.table}>{button}</div>
        <PlayerHands hands={lower} />
        <div></div>
      </div>
    </div>
  );
}

export default GameArea;
