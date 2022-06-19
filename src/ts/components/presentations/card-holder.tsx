import { Component, Index } from "solid-js";
import { SelectableCard } from "./selectable-card";

interface Props {
  displays: string[];
  selectedIndex: number | null;
  onClickCard: (index: number) => void;
}

export const CardHolder: Component<Props> = (props) => {
  const isSelected = (index: number) => index === props.selectedIndex;

  return (
    <div class="app__game__card-holder">
      <Index each={props.displays}>
        {(display, index) => (
          <SelectableCard display={display()} selected={isSelected(index)} onClick={() => props.onClickCard(index)} />
        )}
      </Index>
    </div>
  );
};
