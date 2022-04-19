import React, { useState } from "react";
import classnames from "classnames";
import { UserMode } from "@/domains/game-player";

interface PlayerCardComponentProps {
  mode: UserMode;
  storyPoint: number | null;
  selected: boolean;
  showedDown: boolean;
}

const PlayerCardComponent: React.FunctionComponent<PlayerCardComponentProps> = (props) => {
  const [transition, setTransition] = useState(false);

  React.useEffect(() => {
    if (props.showedDown) {
      const t = setTimeout(() => setTransition(true));
      return () => clearTimeout(t);
    }
  }, []);

  if (props.mode === UserMode.inspector) {
    return (
      <span className="app__game__main__player-card--inspector">
        <span className="app__game__main__player-card__eye"></span>
      </span>
    );
  } else if (props.showedDown && props.storyPoint !== null) {
    const className = classnames({
      "app__game__main__player-card": true,
      "app__game__main__player-card--result": true,
      "app__game__main__player-card--transition": transition,
    });
    return <span className={className}>{props.storyPoint}</span>;
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
