import { Component, For } from "solid-js";
import { SelectableCard } from "./selectable-card";

interface Props {
  displays: string[];
  selectedIndex: number | null;
  onClickCard: (index: number) => void;
}

export const CardHolder: Component<Props> = (props) => {
  return (
    <div class="app__game__card-holder">
      <For each={props.displays}>
        {(display, index) => (
          <SelectableCard
            display={display}
            selected={index() === props.selectedIndex}
            onClick={() => props.onClickCard(index())}
          />
        )}
      </For>
    </div>
  );
};
