import { GameHeaderComponent } from "../presentations/game-header";
import { UserMode } from "@/domains/game-player";
import { GameId } from "@/domains/game";
import { gameActionsContext } from "@/contexts/actions/game-actions";
import { userActionsContext } from "@/contexts/actions/user-actions";
import { mapFuture } from "@/status/util";
import { AveragePointShowcaseWithSpinner } from "../presentations/average-point-showcase-with-spinner";
import { AveragePointShowcase } from "../presentations/average-point-showcase";
import { GameResultArea } from "../presentations/game-result-area";
import { Component, createEffect, Match, Switch, useContext } from "solid-js";
import { useNavigate, useParams } from "solid-app-router";
import { useGameSelectors } from "@/contexts/selectors/game-selectors";

interface Props {}

const ShowAveragePointShowcase = () => {
  const { showDownResult } = useGameSelectors();
  const showDown = () => showDownResult().valueMaybe();
  const average = () => {
    const average = showDown()?.average?.toFixed(1) ?? 0;

    return average.toString();
  };
  const cardCounts = () => showDown()?.cardCounts ?? [];

  return (
    <Switch>
      <Match when={!showDown()}>
        <AveragePointShowcaseWithSpinner />
      </Match>
      <Match when={showDown()}>
        <AveragePointShowcase averagePoint={average()} cardCounts={cardCounts()} />
      </Match>
    </Switch>
  );
};

export const GameResultContainer: Component<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const gameActions = useContext(gameActionsContext);
  const { currentGameName, userHands, currentPlayerInformation, currentGame } = useGameSelectors();
  const changeName = useContext(userActionsContext).useChangeUserName();
  const changeMode = gameActions.useChangeUserMode();
  const currentUserName = () => currentPlayerInformation().name || "";
  const currentUserMode = () => currentPlayerInformation().mode ?? UserMode.normal;
  const signature = () => currentGame().valueMaybe()?.viewModel?.invitationSignature || "";
  const currentStatus = () => mapFuture(currentGame(), (v) => v.status);
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
    if (currentStatus().valueMaybe() !== "ShowedDown") {
      navigate(`/game/${param.gameId}`, { replace: true });
    }
  });

  const onNewGame = () => {
    newGame();
  };

  return (
    <div class="app__game">
      <GameHeaderComponent
        gameName={currentGameName()}
        userName={currentUserName()}
        userMode={currentUserMode()}
        onChangeName={(name) => changeName(name)}
        onChangeMode={(mode) => changeMode(mode)}
        onLeaveGame={() => {
          leaveGame();
          navigate("/", { replace: true });
        }}
        origin={document.location.origin}
        invitationSignature={signature()}
      />
      <main class="app__game__main">
        <GameResultArea onNewGame={onNewGame} lines={userHands()} userMode={currentUserMode()} />
      </main>
      <ShowAveragePointShowcase />
    </div>
  );
};
