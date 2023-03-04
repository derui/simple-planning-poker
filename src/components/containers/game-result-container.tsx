import * as React from "react";
import { useNavigate, useParams } from "react-router";
import { GameHeaderComponent } from "../presentations/game-header";
import AveragePointShowcaseWithSpinnerComponent from "../presentations/average-point-showcase-with-spinner";
import AveragePointShowcaseComponent from "../presentations/average-point-showcase";
import GameAreaResultComponent from "../presentations/game-result-area";
import { UserMode } from "@/domains/game-player";
import { Id } from "@/domains/game";
import gameActionsContext from "@/contexts/actions/game-actions";
import { ShowDownResultViewModel } from "@/status/game/types";
import {
  useCurrentGameName,
  useCurrentGameState,
  useCurrentPlayerInformationState,
  useShowDownResultState,
  useUserHandsState,
} from "@/status/game/selectors";
import userActionsContext from "@/contexts/actions/user-actions";
import { Future, mapFuture } from "@/status/util";

interface Props {}

const createAveragePointShowcase = (showDownResult: Future<ShowDownResultViewModel>) => {
  const value = showDownResult.valueMaybe();

  if (!value) {
    return <AveragePointShowcaseWithSpinnerComponent />;
  }

  const average = value.average.toFixed(1).toString();
  return <AveragePointShowcaseComponent averagePoint={average} cardCounts={value.cardCounts} />;
};

const GameResultContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const gameActions = React.useContext(gameActionsContext);
  const currentGameName = useCurrentGameName();
  const userHands = useUserHandsState();
  const showDownResult = useShowDownResultState();
  const changeName = React.useContext(userActionsContext).useChangeUserName();
  const changeMode = gameActions.useChangeUserMode();
  const currentUserInformation = useCurrentPlayerInformationState();
  const currentUserName = currentUserInformation.name;
  const currentUserMode = currentUserInformation.mode ?? UserMode.normal;
  const currentGameState = useCurrentGameState();
  const signature = currentGameState.valueMaybe()?.viewModel?.invitationSignature;
  const currentStatus = mapFuture(currentGameState, (v) => v.status);
  const openGame = gameActions.useOpenGame();
  const leaveGame = gameActions.useLeaveGame();
  const navigate = useNavigate();
  const newGame = gameActions.useNewGame();

  React.useEffect(() => {
    openGame(param.gameId as Id, () => {
      navigate("/", { replace: true });
    });
  }, [param.gameId]);

  React.useEffect(() => {
    if (currentStatus.valueMaybe() !== "ShowedDown") {
      navigate(`/game/${param.gameId}`, { replace: true });
    }
  }, [currentStatus.valueMaybe()]);

  const onNewGame = () => {
    newGame();
  };

  return (
    <div className="app__game">
      <GameHeaderComponent
        gameName={currentGameName}
        userName={currentUserName || ""}
        userMode={currentUserMode}
        onChangeName={(name) => changeName(name)}
        onChangeMode={(mode) => changeMode(mode)}
        onLeaveGame={() => {
          leaveGame();
          navigate("/", { replace: true });
        }}
        origin={document.location.origin}
        invitationSignature={signature || ""}
      />
      <main className="app__game__main">
        <GameAreaResultComponent onNewGame={onNewGame} lines={userHands} userMode={currentUserMode} />
      </main>
      {createAveragePointShowcase(showDownResult)}
    </div>
  );
};

export default GameResultContainer;
