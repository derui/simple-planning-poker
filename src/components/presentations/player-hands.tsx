import React from "react";
import classnames from "classnames";
import PlayerHandComponent, { PlayerHandComponentProps } from "./player-hand";

interface Props {
  position: "upper" | "lower";
  userHands: Omit<PlayerHandComponentProps, "namePosition">[];
}

export const PlayerHandsComponent: React.FunctionComponent<Props> = (props) => {
  const className = classnames({
    "app__game__main__users-in-upper": props.position === "upper",
    "app__game__main__users-in-lower": props.position === "lower",
  });

  const createUserHand = (props: PlayerHandComponentProps, index: number) => {
    return <PlayerHandComponent key={index} {...props} />;
  };

  return (
    <div className={className}>
      {props.userHands.map((v, index) => createUserHand({ ...v, namePosition: props.position }, index))}
    </div>
  );
};
