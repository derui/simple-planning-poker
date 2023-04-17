import { ReactElement } from "react";
import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";
import { UserMode } from "@/domains/game-player";
import { UserEstimationState } from "@/status/selectors/user-estimation";

interface Props extends BaseProps {
  userName: string;
  userMode: UserMode;
  displayValue: string;
  state: UserEstimationState;
}

const styles = {
  root: classnames("flex", "flex-col", "items-center"),
  card: (state: UserEstimationState) =>
    classnames(
      "flex",
      "flex-col",
      "h-20",
      "w-14",
      "rounded",
      "text-center",
      "items-center",
      "justify-center",
      "border",
      "border-primary-400",
      "m-3",
      "text-primary-500",
      "transition-transform",
      {
        "bg-white": state === "notSelected",
      },
      {
        "bg-primary-400": state === "estimated",
        "text-secondary1-200": state === "estimated",
        "[transform:rotateY(180deg)]": state === "estimated",
      },
      {
        "bg-white": state === "result",
        "text-primary-500": state === "result",
        "[transform:rotateY(0deg)]": state === "result",
      }
    ),

  eye: classnames("flex", "items-center", iconize("eye", { size: "l" }), "before:bg-primary-400"),
};

// eslint-disable-next-line func-style
export function PlayerEstimation(props: Props) {
  const gen = generateTestId(props.testid);

  let card: ReactElement;
  if (props.userMode === UserMode.inspector) {
    card = (
      <span className={styles.card("notSelected")} data-testid={gen("card")} data-mode="inspector">
        <span className={styles.eye} data-testid={gen("eye")}></span>
      </span>
    );
  } else {
    card = (
      <span className={styles.card(props.state)} data-testid={gen("card")} data-mode="normal" data-state={props.state}>
        {props.state === "result" ? props.displayValue : ""}
      </span>
    );
  }

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <span>{props.userName}</span>
      {card}
    </div>
  );
}
