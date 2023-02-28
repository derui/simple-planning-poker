import React from "react";
import { SelectableCard } from "./selectable-card";

interface Props {
  displays: string[];
  selectedIndex: number | null;
  onClickCard: (index: number) => void;
}

const createCard = (
  display: string,
  index: number,
  selectedIndex: number | null,
  onClickCard: (index: number) => void
) => {
  return (
    <SelectableCard
      key={index}
      storyPoint={display}
      selected={index === selectedIndex}
      onSelected={() => onClickCard(index)}
    />
  );
};

export const CardHolderComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="app__game__card-holder">
      {props.displays.map((display, index) => createCard(display, index, props.selectedIndex, props.onClickCard))}
    </div>
  );
};
