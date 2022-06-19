import { PlayerHands } from "../presentations/player-hands";
import { UserMode } from "@/domains/game-player";
import { asStoryPoint } from "@/domains/card";
import { UserHandViewModel } from "@/status/game/types";
import { PlayerHandsWithSpinner } from "./player-hands-with-spinner";
import { Component, Match, Switch } from "solid-js";

interface Props {
  onNewGame: () => void;
  userMode: UserMode;
  lines: { upperLine: UserHandViewModel[]; lowerLine: UserHandViewModel[] };
}

const GameProgressionButton = (props: Props) => {
  if (props.userMode === UserMode.inspector) {
    return <span class="app__game__main__game-management-button--waiting">Inspecting...</span>;
  }
  return (
    <button class="app__game__main__game-management-button--next-game" onClick={() => props.onNewGame()}>
      Start next game
    </button>
  );
};

const convertHands = (hands: UserHandViewModel[]) =>
  hands.map((v) => ({
    ...v,
    storyPoint: v.card ? asStoryPoint(v.card)?.value ?? null : null,
    showedDown: true,
  }));

const Hand: Component<{ position: "upper" | "lower"; hands: UserHandViewModel[] | undefined }> = (props) => {
  const hands = () => props.hands || [];
  return (
    <Switch>
      <Match when={hands()}>
        <PlayerHands position={props.position} userHands={convertHands(hands())} />
      </Match>
      <Match when={!hands()}>
        <PlayerHandsWithSpinner />
      </Match>
    </Switch>
  );
};

export const GameResultArea: Component<Props> = (props) => {
  const button = GameProgressionButton(props);

  return (
    <div class="app__game__main__game-area">
      <div class="app__game__main__grid-container">
        <div class="app__game__main__upper-spacer"></div>
        <Hand position="upper" hands={props.lines.upperLine} />
        <div class="app__game__main__table">{button}</div>
        <Hand position="lower" hands={props.lines.lowerLine} />
        <div class="app__game__main__lower-spacer"></div>
      </div>
    </div>
  );
};
