import React from "react";
import { CardComponent } from "./card";

interface Props {
  displays: string[];
  selectedIndex: number | null;
}

const createCard = (display: string, index: number, selectedIndex: number | null) => {
  return <CardComponent key={index} display={display} selected={index === selectedIndex} />;
};

export const CardHolderComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="app__card-holder">
      {props.displays.map((display, index) => createCard(display, index, props.selectedIndex))}
    </div>
  );
};
