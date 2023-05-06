import { MouseEvent, useState } from "react";
import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";

export interface Props extends BaseProps {
  onClick?: (id: string) => void;
  id: string;
  theme?: string;
  finishedAt: Date;
  averagePoint: number;
}

const Styles = {
  root: classNames(
    "flex",
    "w-full",
    "rounded",
    "border",
    "border-secondary2-400",
    "px-3",
    "py-2",
    "items-center",
    "cursor-pointer",
    "transition-shadow",
    "hover:shadow-lg"
  ),
  container: classNames("flex-1", "flex", "flex-row", "ml-2", "items-center", "justify-center"),
  theme: (noTheme: boolean) =>
    classNames("flex-1", "ml-2", { "text-gray": noTheme, underline: !noTheme, "underline-offset-2": !noTheme }),
  dateContainer: classNames("flex-none", "text-sm", "flex", "justify-center", "items-center"),
  dateTime: classNames("text-sm", "text-gray", "flex", "mx-2"),
  time: (hours: number) =>
    classNames(
      "text-sm",
      "text-gray",
      "flex",
      "items-center",
      iconize(`clock-hour-${hours === 0 ? 12 : hours}`),
      "before:bg-secondary2-400"
    ),
  timeString: (shown: boolean) => classNames({ hidden: !shown, visible: shown }),
  point: classNames("flex", "items-center", "rounded", "bg-secondary2-500", "text-white", "p-2"),
} as const;

const formatToDate = function formatToDate(dateTime: Date) {
  const year = `${dateTime.getFullYear()}`;
  const month = `${dateTime.getMonth() + 1}`;
  const date = `${dateTime.getDate()}`;

  return `${year}/${month.padStart(2, "0")}/${date.padStart(2, "0")}`;
};

const formatToTime = function formatToTime(dateTime: Date) {
  const hour = `${dateTime.getHours()}`;
  const minute = `${dateTime.getMinutes()}`;
  const seconds = `${dateTime.getSeconds()}`;

  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
};

// eslint-disable-next-line func-style
export function RoundHistory(props: Props) {
  const gen = generateTestId(props.testid);
  const [showTime, setShowTime] = useState(false);
  const theme = props.theme ?? "No theme";

  const handleClick = (e: MouseEvent) => {
    if (props.onClick) {
      e.stopPropagation();
      e.preventDefault();
      props.onClick(props.id);
    }
  };

  const handleTimeClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setShowTime(!showTime);
  };

  return (
    <li className={Styles.root} onClick={handleClick} data-testid={gen("root")}>
      <span className={Styles.point} data-testid={gen("point")}>
        {props.averagePoint.toString()}
      </span>
      <span className={Styles.container}>
        <span className={Styles.theme(!props.theme)} data-testid={gen("theme")}>
          {theme}
        </span>
        <span className={Styles.dateContainer} data-testid={gen("date")}>
          <span
            className={Styles.time(props.finishedAt.getHours())}
            onClick={handleTimeClick}
            data-testid={gen("time")}
          >
            <span className={Styles.dateTime}>{formatToDate(props.finishedAt)}</span>
            <span className={Styles.timeString(showTime)}> {formatToTime(props.finishedAt)} </span>
          </span>
        </span>
      </span>
    </li>
  );
}
