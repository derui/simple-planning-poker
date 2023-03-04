import React, { ReactElement } from "react";
import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { UserMode } from "@/domains/game-player";

interface Props extends BaseProps {
  userName: string;
  userMode: UserMode;
  displayValue: string;
  selected: boolean;
  opened: boolean;
}

type State = "notSelected" | "handed" | "result";

const styles = {
  root: classnames("flex", "flex-col", "items-center"),
  card: (state: State) =>
    classnames(
      "flex",
      "flex-col",
      "h-16",
      "w-12",
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
        "bg-primary-400": state === "handed",
        "text-secondary1-200": state === "handed",
        "[transform:rotateY(180deg)]": state === "handed",
      },
      {
        "bg-white": state === "result",
        "text-primary-500": state === "result",
        "[transform:rotateY(0deg)]": state === "result",
      }
    ),

  eye: classnames(
    "block",
    '[mask:url("/assets/svg/tabler-icons/eye.svg")]',
    "[mask-size:contain]",
    "bg-primary-400",
    "h-10",
    "w-10"
  ),
};

// eslint-disable-next-line func-style
export function PlayerHand(props: Props) {
  const gen = generateTestId(props.testid);
  const state = props.opened ? (props.selected ? "result" : "notSelected") : props.selected ? "handed" : "notSelected";

  let card: ReactElement;
  if (props.userMode === UserMode.inspector) {
    card = (
      <span className={styles.card("notSelected", false)} data-testid={gen("card")} data-mode="inspector">
        <span className={styles.eye} data-testid={gen("eye")}></span>
      </span>
    );
  } else {
    card = (
      <span className={styles.card(state)} data-testid={gen("card")} data-mode="normal" data-state={state}>
        {state === "result" ? props.displayValue : ""}
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
