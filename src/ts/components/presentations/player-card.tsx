import React from "react";
import classnames from "classnames";
import { UserMode } from "@/domains/game-player";

interface PlayerCardComponentProps {
  mode: UserMode;
  storyPoint: number | null;
  selected: boolean;
  showedDown: boolean;
}

const PlayerCardComponent: React.FunctionComponent<PlayerCardComponentProps> = (props) => {
  if (props.mode === UserMode.inspector) {
    return (
      <span className="app__game__main__player-card--inspector">
        <span className="app__game__main__player-card__eye"></span>
      </span>
    );
  } else if (props.showedDown && props.storyPoint !== null) {
    return <span className="app__game__main__player-card">{props.storyPoint}</span>;
  } else if (props.showedDown && props.storyPoint === null) {
    return <span className="app__game__main__player-card">?</span>;
  }

  const className = classnames({
    "app__game__main__player-card": true,
    "app__game__main__player-card--handed": props.selected,
  });
  return <span className={className}></span>;
};

export default PlayerCardComponent;
