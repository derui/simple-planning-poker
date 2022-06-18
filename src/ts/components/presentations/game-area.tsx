import { PlayerHands } from "../presentations/player-hands";
import { UserMode } from "@/domains/game-player";
import { asStoryPoint } from "@/domains/card";
import { GameStatus, UserHandViewModel } from "@/status/game/types";
import { Future } from "@/status/util";
import { PlayerHandsWithSpinner } from "./player-hands-with-spinner";
import { Component, Match, Switch } from "solid-js";
import { Grid } from "./grid";

interface Props {
  onShowDown: () => void;
  gameStatus: Future<GameStatus>;
  userMode: UserMode;
  lines: Future<{ upperLine: UserHandViewModel[]; lowerLine: UserHandViewModel[] }>;
}

const GameProgressionButton = (props: Omit<Props, "lines">) => {
  const isInspector = () => props.userMode === UserMode.inspector;
  const status = () => props.gameStatus.valueMaybe();

  return (
    <Switch>
      <Match when={isInspector()}>
        <span class="app__game__main__game-management-button--waiting">Inspecting...</span>
      </Match>
      <Match when={!status() || status() === "ShowedDown"}>
        <span class="app__game__main__game-management-button--waiting">
          <Grid height={24} width={24} />
        </span>
      </Match>
      <Match when={status() === "EmptyUserHand"}>
        <span class="app__game__main__game-management-button--waiting">Waiting to select card...</span>
      </Match>
      <Match when={status() === "CanShowDown"}>
        <button class="app__game__main__game-management-button--show-down" onClick={() => props.onShowDown()}>
          Show down!
        </button>
      </Match>
    </Switch>
  );
};

const convertHands = (hands: UserHandViewModel[]) =>
  hands.map((v) => ({
    ...v,
    storyPoint: v.card ? asStoryPoint(v.card)?.value ?? null : null,
    showedDown: false,
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

export const GameArea: Component<Props> = (props) => {
  return (
    <div class="app__game__main__game-area">
      <div class="app__game__main__grid-container">
        <div class="app__game__main__upper-spacer"></div>
        <Hand position="upper" hands={props.lines.valueMaybe()?.upperLine} />
        <div class="app__game__main__table">
          <GameProgressionButton
            userMode={props.userMode}
            gameStatus={props.gameStatus}
            onShowDown={props.onShowDown}
          />
        </div>
        <Hand position="lower" hands={props.lines.valueMaybe()?.lowerLine} />
        <div class="app__game__main__lower-spacer"></div>
      </div>
    </div>
  );
};
