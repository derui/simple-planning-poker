import classNames from "classnames";
import { useState } from "react";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";
import { FinishedRound } from "../presentations/finished-round";

export type Props = BaseProps;

const Styles = {
  root: (opened: boolean) =>
    classNames("absolute", "top-0", "right-0", "z-40", "h-full", "transition-[transform_width]", {
      "[transform:translateX(100%)]": !opened,
      "w-0": !opened,
      "[transform:translateX(0)]": opened,
      "w-96": opened,
    }),
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
      classNames(iconize("circle-arrow-left"), "transition-transform", "before:bg-primary-400", {
        "before:[transform:rotateZ(180deg)]": opened,
        "before:[transform:rotateZ(0deg)]": !opened,
      }),
  },
  list: {
    root: (opened: boolean) =>
      classNames(
        {
          "border-l": opened,
          "border-l-0": !opened,
        },
        "border-primary-400",
        "shadow-lg",
        "flex",
        "flex-col",
        "p-3",
        "h-full",
        "w-full",
        "bg-white",
        "space-y-3"
      ),
  },
} as const;

// eslint-disable-next-line func-style
export function FinishedRoundSidebarContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const [opened, setOpened] = useState(false);

  const rounds = [
    { theme: "theme", finishedAt: new Date(), id: "1", averagePoint: 1 },

    { theme: "theme", finishedAt: new Date("2021-01-01T12:00:03"), id: "2", averagePoint: 3, estimations: [] },
  ];

  return (
    <div className={Styles.root(opened)} data-testid={gen("root")}>
      <ul className={Styles.list.root(opened)}>
        {rounds.map((v) => (
          <FinishedRound theme={v.theme} averagePoint={v.averagePoint} id={v.id} finishedAt={v.finishedAt} />
        ))}
      </ul>
      <span className={Styles.pullTab.root} onClick={() => setOpened(!opened)} data-testid={gen("pullTab")}>
        <span className={Styles.pullTab.icon(opened)}></span>
      </span>
    </div>
  );
}
