import React from "react";
import { GameInfoComponent } from "./game-info";

interface Props {
  gameName: string;
}

export const GameHeaderComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="app__game__header">
      <GameInfoComponent gameName={props.gameName} />
    </div>
  );
};
