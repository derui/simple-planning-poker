import React, { useState } from "react";
import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { UserMode } from "@/domains/game-player";

interface Props extends BaseProps {
  mode: UserMode;
  display: string;
  selected: boolean;
  opened: boolean;
}

type State = "notSelected" | "handed" | "result";

const styles = {
  root: (state: State, transition: boolean) =>
    classnames(
      "flex",
      "flex-col",
      "h-24",
      "w-12",
      "rounded",
      "bg-white",
      "text-center",
      "justify-center",
      "border",
      "border-primary-400",
      "m-3",
      "text-primary-500",
      "transition-transform",
      {
        "bg-primary-400": state === "handed",
        "text-secondary1-200": state === "handed",
        "[transform:rotateY(180deg)]": state === "handed",
      },
      {
        "bg-primary-400": state === "result",
        "text-secondary1-200": state === "result",
        "[transform:rotateY(180deg)]": state === "result",
      },
      {
        "bg-white": transition,
        "text-primary-500": transition,
        "[transform:rotateY(0deg)]": transition,
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
export default function PlayerCardComponent(props: Props) {
  const gen = generateTestId(props.testid);
  const [transition, setTransition] = useState(false);
  const state = props.opened ? (props.selected ? "result" : "notSelected") : props.selected ? "handed" : "notSelected";

  React.useEffect(() => {
    if (props.opened) {
      const t = setTimeout(() => setTransition(true));
      return () => clearTimeout(t);
    }
  }, []);

  if (props.mode === UserMode.inspector) {
    return (
      <span className={styles.root("notSelected", false)} data-testid={gen("root")} data-mode="inspector">
        <span className={styles.eye} data-testid={gen("eye")}></span>
      </span>
    );
  }

  return (
    <span className={styles.root(state, transition)} data-testid={gen("root")} data-mode="normal" data-state={state}>
      {state === "result" ? props.display : ""}
    </span>
  );
}
