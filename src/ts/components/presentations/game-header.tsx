import React from "react";
import { GameInfoComponent } from "./game-info";
import { UserInfoComponent } from "./user-info";

interface Props {
  gameName: string;
  onChangeName: (name: string) => void;
  userName: string;
}

export const GameHeaderComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="app__game__header">
      <GameInfoComponent gameName={props.gameName} />
      <UserInfoComponent name={props.userName} onChangeName={(name) => props.onChangeName(name)} />
    </div>
  );
};
