import classNames from "classnames";
import { PlayerEstimations } from "../presentations/player-estimations";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { selectUserHandInfos } from "@/status/selectors/user-hand";
import { isFinished } from "@/utils/loadable";
import { selectCanShowDown } from "@/status/selectors/game";
import * as RoundAction from "@/status/actions/round";
import { AppDispatch } from "@/status/store";

const styles = {
  root: classNames("relative", "w-full", "h-full"),
  gridContainer: classNames("w-full", "h-full", "grid", "grid-rows-[1fr_8rem_5rem_8rem_1fr]", "grid-cols-3"),
  hands: classNames("flex"),
  table: classNames(
    "row-start-3",
    "col-start-2",
    "flex",
    "rounded-full",
    "border-2",
    "border-primary-400",
    "bg-secondary1-300",
    "h-20",
    "min-w-fit",
    "flex-col",
    "items-center",
    "justify-center"
  ),

  tableLoading: classNames(
    "row-start-3",
    "col-start-2",
    "flex",
    "rounded-full",
    "border-2",
    "border-primary-400",
    "px-4",
    "h-20",
    "min-w-fit",
    "flex-col",
    "items-center",
    "justify-center"
  ),
  nextGameButton: classNames(
    "flex-none",
    "outline-none",
    "border",
    "border-primary-500",
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

const GameProgressionButton = (dispatch: AppDispatch, displayButton: boolean) => {
  if (!displayButton) {
    return (
      <span className="flex-none" data-testid="waiting">
        Waiting to select card...
      </span>
    );
  }

  return (
    <button className={styles.nextGameButton} onClick={() => dispatch(RoundAction.showDown())}>
      Show down!
    </button>
  );
};

// eslint-disable-next-line func-style
export function GameAreaContainer() {
  const hands = useAppSelector(selectUserHandInfos);
  const displayNewRoundButton = useAppSelector(selectCanShowDown);
  const dispatch = useAppDispatch();

  if (!isFinished(hands)) {
    return (
      <div className={styles.root}>
        <div className={styles.gridContainer}>
          <div className="col-span-full row-start-1"></div>
          <div className="col-start-2 row-start-2 flex items-center">
            <Skeleton testid="upper-loading" />
          </div>
          <div className={styles.tableLoading}>
            <Skeleton testid="table-loading" />
          </div>
          <div className="col-start-2 row-start-4 flex items-center">
            <Skeleton testid="lower-loading" />
          </div>
          <div className="row-start-5 col-span-full"></div>
        </div>
      </div>
    );
  }

  const button = GameProgressionButton(dispatch, displayNewRoundButton);
  const upper = hands[0].filter((_, index) => index % 2 === 0);
  const lower = hands[0].filter((_, index) => index % 2 === 1);

  return (
    <div className={styles.root}>
      <div className={styles.gridContainer}>
        <div className="col-span-full row-start-1"></div>
        <div className="col-start-2 row-start-2">
          <PlayerEstimations hands={upper} testid="hands" />
        </div>
        <div className={styles.table}>{button}</div>
        <div className="col-start-2 row-start-4">
          <PlayerEstimations hands={lower} testid="hands" />
        </div>
        <div className="col-span-full row-start-5"></div>
      </div>
    </div>
  );
}
