import { UserMode } from "@/domains/game-player";
import { PlayerCard } from "./player-card";
import { Component } from "solid-js";

export interface PlayerHandProps {
  namePosition: "upper" | "lower";
  name: string;
  mode: UserMode;
  storyPoint: number | null;
  selected: boolean;
  showedDown: boolean;
}

export const PlayerHand: Component<PlayerHandProps> = (props) => {
  const className = () => ({
    "app__game__main__user-hand-container": true,
    "app__game__main__user-hand-container--flipped": props.namePosition === "lower",
  });

  return (
    <div class="app__game__main__user-hand">
      <div classList={className()}>
        <span class="app__game__main__user-hand__user-name">{props.name}</span>
        <PlayerCard
          mode={props.mode}
          storyPoint={props.storyPoint}
          selected={props.selected}
          showedDown={props.showedDown}
        />
      </div>
    </div>
  );
};
