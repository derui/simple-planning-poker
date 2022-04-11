import * as React from "react";
import { CardHolderComponent } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";
import { PlayerHandsComponent } from "../presentations/player-hands";
import { AveragePointShowcaseComponent } from "../presentations/average-point-showcase";
import { EmptyCardHolderComponent } from "../presentations/empty-card-holder";
import { UserMode } from "@/domains/game-player";
import { asStoryPoint } from "@/domains/card";
import { GameId } from "@/domains/game";
import { useNavigate, useParams } from "react-router";
import gameActionsContext, { GameActions } from "@/contexts/actions/game-actions";
import { GameStatus, ShowDownResultViewModel, UserHandViewModel } from "@/status/game/types";
import {
  useCurrentGameName,
  useCurrentGameState,
  useCurrentGameStatusState,
  useCurrentPlayerInformationState,
  useSelectableCardsState,
  useShowDownResultState,
  useUserHandsState,
} from "@/status/game/selectors";
import userActionsContext from "@/contexts/actions/user-actions";

interface Props {}

const createCardHolderComponent = ({ useSelectCard }: GameActions) => {
  const selectCard = useSelectCard();
  const cards = useSelectableCardsState();
  const selectedIndex = currentPlayerSelectedCardState()?.index;

  const props = {
    displays: cards.map((v) => {
      switch (v.kind) {
        case "giveup":
          return "?";
        case "storypoint":
          return v.storyPoint.value.toString();
      }
    }),
    selectedIndex: selectedIndex ?? null,
  };

  return (
    <CardHolderComponent
      displays={props.displays}
      selectedIndex={props.selectedIndex}
      onClickCard={(index) => selectCard(index)}
    />
  );
};

const createAveragePointShowcase = (showDownResult: ShowDownResultViewModel) => {
  const average = showDownResult.average.toFixed(1).toString();
  return <AveragePointShowcaseComponent averagePoint={average} cardCounts={showDownResult.cardCounts} />;
};

const GameProgressionButton = (status: GameStatus, mode: UserMode, context: GameActions) => {
  const showDown = context.useShowDown();
  const newGame = context.useNewGame();

  if (mode === UserMode.inspector) {
    return <span className="app__game__main__game-management-button--waiting">Inspecting...</span>;
  }

  switch (status) {
    case "EmptyUserHand":
      return <span className="app__game__main__game-management-button--waiting">Waiting to select card...</span>;
    case "CanShowDown":
      return (
        <button className="app__game__main__game-management-button--show-down" onClick={() => showDown()}>
          Show down!
        </button>
      );
    case "ShowedDown":
      return (
        <button className="app__game__main__game-management-button--next-game" onClick={() => newGame()}>
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

const GameContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const gameActions = React.useContext(gameActionsContext);
  const component = createCardHolderComponent(gameActions);
  const currentGameName = useCurrentGameName();
  const { lowerLine, upperLine } = useUserHandsState();
  const currentStatus = useCurrentGameStatusState();
  const showDownResult = useShowDownResultState();
  const changeName = React.useContext(userActionsContext).useChangeUserName();
  const changeMode = gameActions.useChangeUserMode();
  const currentUserInformation = useCurrentPlayerInformationState();
  const currentUserName = currentUserInformation.name;
  const currentUserMode = currentUserInformation.mode ?? UserMode.normal;
  const signature = useCurrentGameState()?.invitationSignature;
  const openGame = gameActions.useOpenGame();
  const leaveGame = gameActions.useLeaveGame();
  const navigate = useNavigate();

  React.useEffect(() => {
    openGame(param.gameId as GameId, () => {
      navigate("/", { replace: true });
    });
  }, [param.gameId]);

  let Component = <EmptyCardHolderComponent />;
  if (currentStatus === "ShowedDown") {
    Component = createAveragePointShowcase(showDownResult);
  } else {
    if (currentUserMode === UserMode.normal) {
      Component = component;
    }
  }
  const button = GameProgressionButton(currentStatus, currentUserMode, gameActions);

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
        <div className="app__game__main__game-area">
          <div className="app__game__main__grid-container">
            <div className="app__game__main__upper-spacer"></div>
            <PlayerHandsComponent position="upper" userHands={convertHands(upperLine, currentStatus)} />
            <div className="app__game__main__table">{button}</div>
            <PlayerHandsComponent position="lower" userHands={convertHands(lowerLine, currentStatus)} />
            <div className="app__game__main__lower-spacer"></div>
          </div>
        </div>
      </main>
      {Component}
    </div>
  );
};

export default GameContainer;
