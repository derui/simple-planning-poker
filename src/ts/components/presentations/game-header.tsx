import React from "react";

interface Props {
  gameName: string;
}

export const GameHeaderComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="app__game__header">
      <h2>Planning Poker: {props.gameName}</h2>
    </div>
  );
};
