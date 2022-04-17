import React from "react";
import classnames from "classnames";
import { UserMode } from "@/domains/game-player";
import PlayerCardComponent from "./player-card";

export interface PlayerHandComponentProps {
  namePosition: "upper" | "lower";
  name: string;
  mode: UserMode;
  storyPoint: number | null;
  selected: boolean;
  showedDown: boolean;
}

const PlayerHandComponent: React.FunctionComponent<PlayerHandComponentProps> = (props) => {
  const card = (
    <PlayerCardComponent
      mode={props.mode}
      storyPoint={props.storyPoint}
      selected={props.selected}
      showedDown={props.showedDown}
    />
  );
  const className = classnames({
    "app__game__main__user-hand-container": true,
    "app__game__main__user-hand-container--flipped": props.namePosition === "lower",
  });

  return (
    <div className="app__game__main__user-hand">
      <div className={className}>
        <span className="app__game__main__user-hand__user-name">{props.name}</span>;{card}
      </div>
    </div>
  );
};

export default PlayerHandComponent;
