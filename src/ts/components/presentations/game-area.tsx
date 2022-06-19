import { PlayerHands } from "../presentations/player-hands";
import { UserMode } from "@/domains/game-player";
import { asStoryPoint } from "@/domains/card";
import { GameStatus, UserHandViewModel } from "@/status/game/types";
import { PlayerHandsWithSpinner } from "./player-hands-with-spinner";
import { Component, createEffect, createSignal, Match, Switch } from "solid-js";
import { Grid } from "./grid";

interface Props {
  onShowDown: () => void;
  gameStatus: GameStatus | undefined;
  userMode: UserMode;
  lines: { upperLine: UserHandViewModel[]; lowerLine: UserHandViewModel[] };
}

const GameProgressionButton = (props: Omit<Props, "lines"> & { loading: boolean }) => {
  const isInspector = () => props.userMode === UserMode.inspector;
  const status = () => props.gameStatus;

  return (
    <Switch>
      <Match when={props.loading}>
        <span class="app__game__main__game-management-button--waiting">
          <Grid classes={["app__game__main__game-management-button-grid"]} />
        </span>
      </Match>
      <Match when={isInspector()}>
        <span class="app__game__main__game-management-button--waiting">Inspecting...</span>
      </Match>
      <Match when={!status() || status() === "ShowedDown"}>
        <span class="app__game__main__game-management-button--waiting">
          <Grid />
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

const Hand: Component<{ loading: boolean; position: "upper" | "lower"; hands: UserHandViewModel[] | undefined }> = (
  props
) => {
  const hands = () => props.hands || [];

  return (
    <Switch>
      <Match when={props.loading}>
        <PlayerHandsWithSpinner position={props.position} />
      </Match>
      <Match when={hands()}>
        <PlayerHands position={props.position} userHands={convertHands(hands())} />
      </Match>
      <Match when={!hands()}>
        <PlayerHandsWithSpinner position={props.position} />
      </Match>
    </Switch>
  );
};

export const GameArea: Component<Props> = (props) => {
  const [transition, setTransition] = createSignal(true);

  createEffect(() => {
    setTimeout(() => {
      setTransition(false);
    }, 500);
  });

  return (
    <div class="app__game__main__game-area">
      <div class="app__game__main__grid-container">
        <div class="app__game__main__upper-spacer"></div>
        <Hand loading={transition()} position="upper" hands={props.lines.upperLine} />
        <div class="app__game__main__table">
          <GameProgressionButton
            loading={transition()}
            userMode={props.userMode}
            gameStatus={props.gameStatus}
            onShowDown={props.onShowDown}
          />
        </div>
        <Hand loading={transition()} position="lower" hands={props.lines.lowerLine} />
        <div class="app__game__main__lower-spacer"></div>
      </div>
    </div>
  );
};
