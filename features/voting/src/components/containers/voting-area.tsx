import clsx from "clsx";
import { PlayerEstimations } from "../presentations/player-estimations";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Skeleton } from "../presentations/skeleton";
import { RoundThemeEditor } from "../presentations/round-theme-editor";
import { selectUserEstimationInfos } from "@/status/selectors/user-estimation";
import { isFinished } from "@/utils/loadable";
import { selectCanShowDown } from "@/status/selectors/game";
import * as RoundAction from "@/status/actions/round";
import { AppDispatch } from "@/status/store";
import { selectRoundInformation } from "@/status/selectors/round";

const styles = {
  root: clsx("relative", "w-full", "h-full"),
  gridContainer: clsx(
    "w-full",
    "h-full",
    "grid",
    "grid-rows-[1fr_8rem_5rem_8rem_1fr]",
    "grid-cols-[1fr_max-content_1fr]"
  ),
  estimations: clsx("flex"),
  table: clsx(
    "row-start-3",
    "col-start-2",
    "flex",
    "rounded-full",
    "border-2",
    "border-primary-400",
    "bg-secondary1-300",
    "h-20",
    "px-12",
    "min-w-fit",
    "flex-col",
    "items-center",
    "justify-center"
  ),

  tableLoading: clsx(
    "row-start-3",
    "col-start-2",
    "flex",
    "rounded-full",
    "border-2",
    "border-primary-400",
    "px-4",
    "h-20",
    "w-48",
    "min-w-fit",
    "flex-col",
    "items-center",
    "justify-center"
  ),
  nextGameButton: clsx(
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
  const estimations = useAppSelector(selectUserEstimationInfos);
  const displayNewRoundButton = useAppSelector(selectCanShowDown);
  const roundInformation = useAppSelector(selectRoundInformation());
  const dispatch = useAppDispatch();

  if (!isFinished(estimations) || !isFinished(roundInformation)) {
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
  const upper = estimations[0].filter((_, index) => index % 2 === 0);
  const lower = estimations[0].filter((_, index) => index % 2 === 1);
  const handleThemeChange = (theme: string) => {
    dispatch(RoundAction.changeTheme(theme));
  };

  return (
    <div className={styles.root}>
      <div className={styles.gridContainer}>
        <div className="col-span-full row-start-1 ml-12">
          <RoundThemeEditor
            onThemeChange={handleThemeChange}
            editable={!roundInformation[0].finished}
            initialTheme={roundInformation[0].theme}
            testid="themeEditor"
          />
        </div>
        <div className="col-start-2 row-start-2">
          <PlayerEstimations estimations={upper} testid="estimations" />
        </div>
        <div className={styles.table}>{button}</div>
        <div className="col-start-2 row-start-4">
          <PlayerEstimations estimations={lower} testid="estimations" />
        </div>
        <div className="col-span-full row-start-5"></div>
      </div>
    </div>
  );
}
