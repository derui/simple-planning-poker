import { PlayerHands } from "../presentations/player-hands";
import { BaseProps } from "../base";
import { UserMode } from "@/domains/game-player";
import { UserHandInfo } from "@/status/selectors/user-hand";

interface Props extends BaseProps {
  onNewGame: () => void;
  userMode: UserMode;
  hands: UserHandInfo[];
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
    return <PlayerHands position={position} userHands={convertHands(hands)} />;
  }

  return <PlayerHandsWithSpinnerComponent />;
};

// eslint-disable-next-line func-style
export function GameArea(props: Props) {
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
}

export default GameArea;
