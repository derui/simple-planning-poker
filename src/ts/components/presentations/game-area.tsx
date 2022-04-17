import * as React from "react";
import { PlayerHandsComponent } from "../presentations/player-hands";
import { UserMode } from "@/domains/game-player";
import { asStoryPoint } from "@/domains/card";
import { GameStatus, UserHandViewModel } from "@/status/game/types";
import { Future } from "@/status/util";
import PlayerHandsWithSpinnerComponent from "./player-hands-with-spinner";
import { Grid } from "react-loader-spinner";

interface Props {
  onShowDown: () => void;
  onNewGame: () => void;
  gameStatus: Future<GameStatus>;
  userMode: UserMode;
  lines: Future<{ upperLine: UserHandViewModel[]; lowerLine: UserHandViewModel[] }>;
}

const GameProgressionButton = (props: Props) => {
  const { userMode, gameStatus, onShowDown, onNewGame } = props;

  if (userMode === UserMode.inspector) {
    return <span className="app__game__main__game-management-button--waiting">Inspecting...</span>;
  }

  const status = gameStatus.valueMaybe();
  if (!status) {
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
    case "ShowedDown":
      return (
        <button className="app__game__main__game-management-button--next-game" onClick={() => onNewGame()}>
          Start next game
        </button>
      );
  }
};

const convertHands = (hands: UserHandViewModel[], currentStatus: GameStatus) =>
  hands.map((v) => ({
    ...v,
    storyPoint: v.card ? asStoryPoint(v.card)?.value ?? null : null,
    showedDown: currentStatus === "ShowedDown",
  }));

const toHands = (position: "upper" | "lower", hands: UserHandViewModel[] | undefined, currentStatus?: GameStatus) => {
  if (hands && currentStatus) {
    return <PlayerHandsComponent position={position} userHands={convertHands(hands, currentStatus)} />;
  }

  return <PlayerHandsWithSpinnerComponent />;
};

const GameAreaComponent: React.FunctionComponent<Props> = (props) => {
  const button = GameProgressionButton(props);
  const upper = toHands("upper", props.lines.valueMaybe()?.upperLine, props.gameStatus.valueMaybe());
  const lower = toHands("lower", props.lines.valueMaybe()?.lowerLine, props.gameStatus.valueMaybe());

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
