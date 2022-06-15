import { Component } from "solid-js";

interface Props {
  display: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectableCard: Component<Props> = (props) => {
  const className = {
    "app__game__selectable-card": true,
    "app__game__selectable-card--selected": props.selected,
  };

  return (
    <div classList={className} onClick={props.onClick}>
      <span class="app__game__selectable-card__storypoint">{props.display}</span>
    </div>
  );
};
