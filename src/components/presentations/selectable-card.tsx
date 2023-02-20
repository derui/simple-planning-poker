import React from "react";
import classnames from "classnames";

interface Props {
  display: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectableCardComponent: React.FunctionComponent<Props> = (props) => {
  const className = classnames({
    "app__game__selectable-card": true,
    "app__game__selectable-card--selected": props.selected,
  });

  return (
    <div className={className} onClick={props.onClick}>
      <span className="app__game__selectable-card__storypoint">{props.display}</span>
    </div>
  );
};
