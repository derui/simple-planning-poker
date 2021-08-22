import React from "react";
import classnames from "classnames";

interface Props {
  display: string;
  selected: boolean;
}

export const CardComponent: React.FunctionComponent<Props> = (props) => {
  const className = classnames({
    "app__storypoint-card": true,
    "app__storypoint-card--selected": props.selected,
  });

  return (
    <div className={className}>
      <span className="app__storypoint-card__storypoint">{props.display}</span>
    </div>
  );
};
