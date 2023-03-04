import * as React from "react";
import { Grid } from "react-loader-spinner";
import { PlayerHands } from "../presentations/player-hands";
import PlayerHandsWithSpinnerComponent from "./player-hands-with-spinner";
import { UserMode } from "@/domains/game-player";
import { asStoryPoint } from "@/domains/card";
import { GameStatus, UserHandViewModel } from "@/status/game/types";
import { Future } from "@/status/util";

interface Props {
  onShowDown: () => void;
  gameStatus: Future<GameStatus>;
  userMode: UserMode;
  lines: Future<{ upperLine: UserHandViewModel[]; lowerLine: UserHandViewModel[] }>;
}

const GameProgressionButton = (props: Props) => {
  const { userMode, gameStatus, onShowDown } = props;

  if (userMode === UserMode.inspector) {
    return <span className="app__game__main__game-management-button--waiting">Inspecting...</span>;
  }

  const status = gameStatus.valueMaybe();
  if (!status || status === "ShowedDown") {
    return (
      <span className="app__game__main__game-management-button--waiting">
        <Grid height={24} width={24} />
      </span>
    );
  }

  switch (status) {
    case "EmptyUserHand":
      return <span className="app__game__main__game-management-button--waiting">Waiting to select card...</span>;
    case "CanShowDown":
      return (
        <button className="app__game__main__game-management-button--show-down" onClick={() => onShowDown()}>
          Show down!
        </button>
      );
  }
};

const convertHands = (hands: UserHandViewModel[]) =>
  hands.map((v) => ({
    ...v,
    storyPoint: v.card ? asStoryPoint(v.card)?.value ?? null : null,
    showedDown: false,
  }));

const toHands = (position: "upper" | "lower", hands: UserHandViewModel[] | undefined) => {
  if (hands) {
    return <PlayerHands position={position} userHands={convertHands(hands)} />;
  }

  return <PlayerHandsWithSpinnerComponent />;
};

const GameAreaComponent: React.FunctionComponent<Props> = (props) => {
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

export default GameAreaComponent;
