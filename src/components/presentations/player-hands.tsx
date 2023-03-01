import React from "react";
import classnames from "classnames";
import PlayerHandComponent, { Props } from "./player-hand";
import { UserMode } from "@/domains/game-player";

interface Props {
  name: string;
  mode: UserMode;
  storyPoint: number | null;
  selected: boolean;
  showedDown: boolean;
}

const styles = {
  root: classnames("flex", "justify-around"),
};

export const PlayerHandsComponent: React.FunctionComponent<Props> = (props) => {
  const createUserHand = (props: Props, index: number) => {
    return <PlayerHandComponent key={index} {...props} />;
  };

  return (
    <div className={className}>
      {props.userHands.map((v, index) => createUserHand({ ...v, namePosition: props.position }, index))}
    </div>
  );
};
