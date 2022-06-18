import { Component, For } from "solid-js";
import { PlayerHand, PlayerHandProps } from "./player-hand";

interface Props {
  position: "upper" | "lower";
  userHands: Omit<PlayerHandProps, "namePosition">[];
}

export const PlayerHands: Component<Props> = (props) => {
  const className = {
    "app__game__main__users-in-upper": props.position === "upper",
    "app__game__main__users-in-lower": props.position === "lower",
  };

  return (
    <div classList={className}>
      <For each={props.userHands}>{(v) => <PlayerHand namePosition={props.position} {...v} />}</For>
    </div>
  );
};
