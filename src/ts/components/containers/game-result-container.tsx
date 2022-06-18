import { GameHeaderComponent } from "../presentations/game-header";
import { UserMode } from "@/domains/game-player";
import { GameId } from "@/domains/game";
import { gameActionsContext } from "@/contexts/actions/game-actions";
import { ShowDownResultViewModel } from "@/status/game/types";
import { userActionsContext } from "@/contexts/actions/user-actions";
import { Future, mapFuture } from "@/status/util";
import { AveragePointShowcaseWithSpinner } from "../presentations/average-point-showcase-with-spinner";
import { AveragePointShowcase } from "../presentations/average-point-showcase";
import { GameResultArea } from "../presentations/game-result-area";
import { Component, createEffect, useContext } from "solid-js";
import { useNavigate, useParams } from "solid-app-router";
import { useGameSelectors } from "@/contexts/selectors/game-selectors";

interface Props {}

const createAveragePointShowcase = (showDownResult: Future<ShowDownResultViewModel>) => {
  const value = showDownResult.valueMaybe();

  if (!value) {
    return <AveragePointShowcaseWithSpinner />;
  }

  const average = value.average.toFixed(1).toString();
  return <AveragePointShowcase averagePoint={average} cardCounts={value.cardCounts} />;
};

export const GameResultContainer: Component<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const gameActions = useContext(gameActionsContext);
  const selectors = useGameSelectors();
  const currentGameName = selectors.currentGameName();
  const userHands = selectors.userHands();
  const showDownResult = selectors.showDownResult();
  const changeName = useContext(userActionsContext).useChangeUserName();
  const changeMode = gameActions.useChangeUserMode();
  const currentUserInformation = selectors.currentPlayerInformation();
  const currentUserName = currentUserInformation.name;
  const currentUserMode = currentUserInformation.mode ?? UserMode.normal;
  const currentGameState = selectors.currentGame();
  const signature = currentGameState.valueMaybe()?.viewModel?.invitationSignature;
  const currentStatus = mapFuture(currentGameState, (v) => v.status);
  const openGame = gameActions.useOpenGame();
  const leaveGame = gameActions.useLeaveGame();
  const navigate = useNavigate();
  const newGame = gameActions.useNewGame();

  createEffect(() => {
    openGame(param.gameId as GameId, () => {
      navigate("/", { replace: true });
    });
  });

  createEffect(() => {
    if (currentStatus.valueMaybe() !== "ShowedDown") {
      navigate(`/game/${param.gameId}`, { replace: true });
    }
  });

  const onNewGame = () => {
    newGame();
  };

  return (
    <div class="app__game">
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
      <main class="app__game__main">
        <GameResultArea onNewGame={onNewGame} lines={userHands} userMode={currentUserMode} />
      </main>
      {createAveragePointShowcase(showDownResult)}
    </div>
  );
};
