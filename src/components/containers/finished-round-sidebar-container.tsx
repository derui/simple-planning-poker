import classNames from "classnames";
import { useState } from "react";
import { BaseProps, generateTestId } from "../base";
import { useAppSelector } from "../hooks";
import { iconize } from "../iconize";
import { FinishedRound } from "../presentations/finished-round";
import { Skeleton } from "../presentations/skeleton";
import { isFinished } from "@/utils/loadable";
import { selectFinishedRoundList } from "@/status/selectors/finished-rounds";

export type Props = BaseProps;

const Styles = {
  root: (opened: boolean, loading: boolean) =>
    classNames(
      "absolute",
      "top-0",
      "right-0",
      "z-40",
      "h-full",
      "shadow-lg",
      "bg-white",
      "transition-[transform_width]",
      {
        "border-l": opened,
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
      "cursor-pointer"
    ),
    icon: (opened: boolean) =>
      classNames(iconize("circle-arrow-left"), "transition-transform", "before:bg-primary-400", "overflow-auto", {
        "before:[transform:rotateZ(180deg)]": opened,
        "before:[transform:rotateZ(0deg)]": !opened,
      }),
  },
  list: classNames("flex-auto", "flex", "flex-col", "p-3", "h-full", "w-full", "bg-white", "space-y-3"),

  paginator: {
    root: classNames("flex-none", "flex", "flex-row", "items-center", "justify-center", "px-3", "h-16"),
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
export function FinishedRoundSidebarContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const [opened, setOpened] = useState(false);
  const rounds = useAppSelector(selectFinishedRoundList);
  const page = 1;

  if (!isFinished(rounds)) {
    return (
      <div className={Styles.root(opened, true)} data-testid={gen("root")}>
        <span className={Styles.pullTab.root} onClick={() => setOpened(!opened)} data-testid={gen("pullTab")}>
          <span className={Styles.pullTab.icon(opened)}></span>
        </span>

        <div className={Styles.container}>
          <div className={Styles.list}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          <div className={Styles.paginator.root}>
            <Skeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.root(opened, false)} data-testid={gen("root")}>
      <span className={Styles.pullTab.root} onClick={() => setOpened(!opened)} data-testid={gen("pullTab")}>
        <span className={Styles.pullTab.icon(opened)}></span>
      </span>
      <div className={Styles.container}>
        <ul className={Styles.list}>
          {rounds[1].map((v) => (
            <FinishedRound
              key={v.id}
              theme={v.theme}
              averagePoint={v.averagePoint}
              id={v.id}
              finishedAt={v.finishedAt}
            />
          ))}
        </ul>
        <div className={Styles.paginator.root}>
          <button className={Styles.paginator.back(page > 1)} data-testid={gen("back")} disabled={page <= 1}></button>
          <button
            className={Styles.paginator.forward(rounds.length > 0)}
            data-testid={gen("forward")}
            disabled={rounds.length <= 0}
          ></button>
        </div>
      </div>
    </div>
  );
}
