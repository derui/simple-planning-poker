import { UserMode } from "@/domains/game-player";
import { Component, createEffect, createSignal, Show } from "solid-js";

interface PlayerCardProps {
  mode: UserMode;
  storyPoint: number | null;
  selected: boolean;
  showedDown: boolean;
}

const PlayerCard: Component<PlayerCardProps> = (props) => {
  const [transition, setTransition] = createSignal(false);

  createEffect(() => {
    if (props.showedDown) {
      const t = setTimeout(() => setTransition(true));
      return () => clearTimeout(t);
    }
  });

  const isInspector = () => props.mode == UserMode.inspector;
  const isPointPrintedOut = () => props.showedDown && props.storyPoint !== null;
  const isUnknown = () => props.showedDown && props.storyPoint === null;

  const classList = {
    "app__game__main__player-card": true,
    "app__game__main__player-card--inspector": isInspector(),
    "app__game__main__player-card--result": isPointPrintedOut() && transition(),
    "app__game__main__player-card--transition": isPointPrintedOut() && transition(),
    "app__game__main__player-card--handed": props.selected,
  };
  return (
    <span classList={classList}>
      <Show when={isPointPrintedOut()}>{props.storyPoint}</Show>
      <Show when={isUnknown()}>?</Show>
    </span>
  );
};

export default PlayerCard;
