import { PropsWithChildren, ReactElement } from "react";
import clsx from "clsx";
import { Icon, Icons } from "@spp/ui-icon";

interface Props {
  name: string;
  mode: "player" | "inspector";
  state: "notSelected" | "estimated" | "revealed";
}

const styles = {
  root: clsx("grid", "grid-rows-[auto_1fr]", "grid-cols-1", "m-3", "text-center", "max-w-12"),
  card: (state: Props["state"]) =>
    clsx(
      "grid",
      "place-content-center",
      "h-20",
      "w-14",
      "rounded",
      "text-center",
      "items-center",
      "justify-center",
      "border",
      "border-orange-400",
      "text-orange-700",
      "transition-transform",
      {
        "bg-white": state === "notSelected",
      },
      {
        "bg-orange-200": state === "estimated",
        "[transform:rotateY(180deg)]": state === "estimated",
      },
      {
        "bg-white": state === "revealed",
        "[transform:rotateY(0deg)]": state === "revealed",
      }
    ),

  eye: clsx("grid", "place-content-center"),
};

// eslint-disable-next-line func-style
export function PlayerEstimation(props: PropsWithChildren<Props>) {
  let card: ReactElement;

  if (props.mode === "inspector") {
    card = (
      <span className={styles.card("notSelected")} data-mode="inspector">
        <Icon type={Icons.eye} variant="orange" />
      </span>
    );
  } else {
    card = (
      <span className={styles.card(props.state)} data-mode="player" data-state={props.state}>
        {props.state === "revealed" ? props.children : null}
      </span>
    );
  }

  return (
    <div className={styles.root}>
      <span>{props.name}</span>
      {card}
    </div>
  );
}
