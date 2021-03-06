import * as React from "react";
import { PlayerHandsComponent } from "../presentations/player-hands";
import { UserMode } from "@/domains/game-player";
import { asStoryPoint } from "@/domains/card";
import { UserHandViewModel } from "@/status/game/types";
import { Future } from "@/status/util";
import PlayerHandsWithSpinnerComponent from "./player-hands-with-spinner";

interface Props {
  onNewGame: () => void;
  userMode: UserMode;
  lines: Future<{ upperLine: UserHandViewModel[]; lowerLine: UserHandViewModel[] }>;
}

const GameProgressionButton = (props: Props) => {
  const { userMode, onNewGame } = props;

  if (userMode === UserMode.inspector) {
    return <span className="app__game__main__game-management-button--waiting">Inspecting...</span>;
  }
  return (
    <button className="app__game__main__game-management-button--next-game" onClick={() => onNewGame()}>
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

const toHands = (position: "upper" | "lower", hands: UserHandViewModel[] | undefined) => {
  if (hands) {
    return <PlayerHandsComponent position={position} userHands={convertHands(hands)} />;
  }

  return <PlayerHandsWithSpinnerComponent />;
};

const GameAreaResultComponent: React.FunctionComponent<Props> = (props) => {
  const button = GameProgressionButton(props);
  const upper = toHands("upper", props.lines.valueMaybe()?.upperLine);
  const lower = toHands("lower", props.lines.valueMaybe()?.lowerLine);

  return (
    <div className="app__game__main__game-area">
      <div className="app__game__main__grid-container">
        <div className="app__game__main__upper-spacer"></div>
        {upper}
        <div className="app__game__main__table">{button}</div>
        {lower}
        <div className="app__game__main__lower-spacer"></div>
      </div>
    </div>
  );
};

export default GameAreaResultComponent;
