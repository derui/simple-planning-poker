import React from "react";
import classnames from "classnames";

export interface PlayerHandComponentProps {
  namePosition: "upper" | "lower";
  name: string;
  storyPoint: number | null;
  handed: boolean;
  showedDown: boolean;
}

export const PlayerHandComponent: React.FunctionComponent<PlayerHandComponentProps> = (props) => {
  let Card = null;
  if (props.showedDown && props.storyPoint) {
    Card = <span className="app__game__main__user-hand__user-card">{props.storyPoint}</span>;
  } else {
    const className = classnames({
      "app__game__main__user-hand__user-card": true,
      "app__game__main__user-hand__user-card--handed": props.handed,
    });
    Card = <span className={className}></span>;
  }
  const Name = <span className="app__game__main__user-hand__user-name">{props.name}</span>;

  return (
    <div className="app__game__main__user-hand">
      <div className="app__game__main__user-hand-container">
        {props.namePosition === "upper" ? Name : null}
        {Card}
        {props.namePosition === "lower" ? Name : null}
      </div>
    </div>
  );
};