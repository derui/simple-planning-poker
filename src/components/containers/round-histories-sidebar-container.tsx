import type { MouseEvent } from "react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { BaseProps, generateTestId } from "../base";
import { useAppDispatch, useAppSelector } from "../hooks";
import { iconize } from "../iconize";
import { RoundHistory } from "../presentations/round-history";
import { Skeleton } from "../presentations/skeleton";
import { isFinished } from "@/utils/loadable";
import { selectTopPage, selectRoundHistories } from "@/status/selectors/round-history";
import {
  nextPageOfRoundHistories,
  closeRoundHistories,
  openRoundHistories,
  resetPageOfRoundHistories,
} from "@/status/actions/round";

const ROUND_HISTORY_COUNT = 10;

export interface Props extends BaseProps {
  onRoundSelect?: (id: string) => void;
}

const Styles = {
  root: (opened: boolean) =>
    classNames(
      "absolute",
      "z-20",
      "top-0",
      "right-0",
      "z-40",
      "h-full",
      "shadow-lg",
      "bg-white",
      "transition-[transform_width]",
      {
        "border-l": opened,
        "border-l-primary-400": opened,
        "border-l-0": !opened,
        "[transform:translateX(100%)]": !opened,
        "w-0": !opened,
        "[transform:translateX(0)]": opened,
        "w-96": opened,
      }
    ),

  container: classNames("flex", "flex-col", "overflow-hidden", "h-full"),
  pullTab: {
    root: classNames(
      "absolute",
      "inline-block",
      "top-24",
      "-left-10",
      "w-10",
      "h-10",
      "px-3",
      "py-2",
      "rounded-l-full",
      "border",
      "border-primary-400",
      "border-r-0",
      "transition-[width_left]",
      "hover:-left-14",
      "hover:w-14",
      "bg-white",
      "cursor-pointer"
    ),
    icon: (opened: boolean) =>
      classNames(iconize("circle-arrow-left"), "transition-transform", "before:bg-primary-400", "overflow-auto", {
        "before:[transform:rotateZ(180deg)]": opened,
        "before:[transform:rotateZ(0deg)]": !opened,
      }),
  },
  list: classNames(
    "flex-auto",
    "overflow-auto",
    "flex",
    "flex-col",
    "p-3",
    "h-full",
    "w-full",
    "bg-white",
    "space-y-3"
  ),

  paginator: {
    root: classNames(
      "flex-none",
      "flex",
      "flex-row",
      "items-center",
      "justify-center",
      "px-3",
      "h-16",
      "border-t",
      "border-t-primary-400/50"
    ),
    back: (enabled: boolean) =>
      classNames("flex-none", iconize("chevron-left"), "w-6", "h-6", "transition-shadow", {
        "before:bg-secondary1-400": enabled,
        "hover:before:bg-secondary1-500": enabled,
        "active:shadow-md": enabled,
        "before:bg-lightgray": !enabled,
      }),
    forward: (enabled: boolean) =>
      classNames("flex-none", iconize("chevron-right"), "w-6", "h-6", "transition-shadow", {
        "before:bg-secondary1-400": enabled,
        "hover:before:bg-secondary1-500": enabled,
        "active:shadow-md": enabled,
        "before:bg-lightgray": !enabled,
      }),
  },
} as const;

// eslint-disable-next-line func-style
function LoadingContent(props: BaseProps) {
  const gen = generateTestId(props.testid);

  return (
    <div className={Styles.container}>
      <div className={Styles.list}>
        <Skeleton testid={gen("skeleton")} />
        <Skeleton testid={gen("skeleton")} />
        <Skeleton testid={gen("skeleton")} />
      </div>
      <div className={Styles.paginator.root}>
        <Skeleton testid={gen("skeleton")} />
      </div>
    </div>
  );
}

// eslint-disable-next-line func-style
export function RoundHistoriesSidebarContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const [opened, setOpened] = useState(false);
  const rounds = useAppSelector(selectRoundHistories);
  const isTopPage = useAppSelector(selectTopPage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (opened) {
      dispatch(openRoundHistories());
    } else {
      dispatch(closeRoundHistories());
    }
  }, [opened]);

  const handleNextPage = (e: MouseEvent) => {
    e.stopPropagation();

    dispatch(nextPageOfRoundHistories());
  };

  const handleTopPage = (e: MouseEvent) => {
    e.stopPropagation();

    dispatch(resetPageOfRoundHistories());
  };

  const handleRoundSelect = (id: string) => {
    if (props.onRoundSelect) {
      props.onRoundSelect(id);
    }
  };

  let content: JSX.Element;

  if (!isFinished(rounds)) {
    content = <LoadingContent testid={props.testid} />;
  } else {
    content = (
      <div className={Styles.container}>
        <ul className={Styles.list}>
          {rounds[0].histories.map((v) => (
            <RoundHistory
              testid={gen(`round/${v.id}`)}
              key={v.id}
              theme={v.theme}
              averagePoint={v.averagePoint}
              id={v.id}
              finishedAt={v.finishedAt}
              onClick={handleRoundSelect}
            />
          ))}
        </ul>
        <div className={Styles.paginator.root}>
          <button
            className={Styles.paginator.back(!isTopPage)}
            onClick={handleTopPage}
            data-testid={gen("back")}
            disabled={isTopPage}
          ></button>
          <button
            className={Styles.paginator.forward(rounds.length < ROUND_HISTORY_COUNT)}
            onClick={handleNextPage}
            data-testid={gen("forward")}
            disabled={rounds.length <= 0}
          ></button>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.root(opened)} data-testid={gen("root")}>
      <span className={Styles.pullTab.root} onClick={() => setOpened(!opened)} data-testid={gen("pullTab")}>
        <span className={Styles.pullTab.icon(opened)}></span>
      </span>
      {content}
    </div>
  );
}
