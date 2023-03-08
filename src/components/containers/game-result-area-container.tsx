import classNames from "classnames";
import { PlayerHands } from "../presentations/player-hands";
import { BaseProps } from "../base";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { selectUserHandInfos } from "@/status/selectors/user-hand";
import { isFinished } from "@/utils/loadable";
import { AppDispatch } from "@/status/store";
import { newRound } from "@/status/actions/game";

type Props = BaseProps;

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

const GameProgressionButton = (dispatch: AppDispatch) => {
  return (
    <button className={styles.nextGameButton} onClick={() => dispatch(newRound())}>
      Start next round
    </button>
  );
};

// eslint-disable-next-line func-style
export function GameResultAreaContainer() {
  const hands = useAppSelector(selectUserHandInfos());
  const dispatch = useAppDispatch();

  if (!isFinished(hands)) {
    return (
      <div className={styles.root}>
        <div className={styles.gridContainer}>
          <div></div>
          <Skeleton testid="upper-loading" />
          <div className={styles.table}>
            <Skeleton testid="table-loading" />
          </div>
          <Skeleton testid="lower-loading" />
          <div></div>
        </div>
      </div>
    );
  }

  const button = GameProgressionButton(dispatch);
  const upper = hands[0].filter((_, index) => index % 2 === 0);
  const lower = hands[0].filter((_, index) => index % 2 === 1);

  return (
    <div className={styles.root}>
      <div className={styles.gridContainer}>
        <div></div>
        <PlayerHands hands={upper} testid="upper" />
        <div className={styles.table}>{button}</div>
        <PlayerHands hands={lower} testid="lower" />
        <div></div>
      </div>
    </div>
  );
}