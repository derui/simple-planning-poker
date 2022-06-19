import { Component, For, mergeProps } from "solid-js";
import { PlayerHand, PlayerHandProps } from "./player-hand";

interface Props {
  position: "upper" | "lower";
  userHands: Omit<PlayerHandProps, "namePosition">[];
}

export const PlayerHands: Component<Props> = (props) => {
  const isUpper = () => props.position === "upper";
  const isLower = () => props.position === "lower";
  const className = () => ({
    "app__game__main__users-in-upper": isUpper(),
    "app__game__main__users-in-lower": isLower(),
  });

  return (
    <div classList={className()}>
      <For each={props.userHands}>
        {(v) => {
          const childProps = mergeProps(v, { namePosition: props.position });
          return <PlayerHand {...childProps} />;
        }}
      </For>
    </div>
  );
};
