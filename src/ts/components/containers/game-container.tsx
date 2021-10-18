import * as React from "react";
import { inGameActionContext, inGameSelectorContext, userActionsContext } from "~/src/ts/contexts/actions";
import { InGameAction, InGameStatus } from "~/src/ts/status/in-game-action";
import { CardHolderComponent } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";
import { PlayerHandsComponent } from "../presentations/player-hands";
import { AveragePointShowcaseComponent } from "../presentations/average-point-showcase";
import { signInSelectors } from "~/src/ts/status/signin";
import { EmptyCardHolderComponent } from "../presentations/empty-card-holder";
import { InGameSelector } from "~/src/ts/status/in-game-selector";
import { ShowDownResultViewModel, UserHandViewModel } from "~/src/ts/status/in-game-atom";
import { UserMode } from "~/src/ts/domains/game-player";
import { asStoryPoint } from "~/src/ts/domains/card";
import { useHistory, useParams } from "react-router-dom";
import { GameId } from "~/src/ts/domains/game";

interface Props {}

const createCardHolderComponent = ({ useSelectCard }: InGameAction, selectors: InGameSelector) => {
  const selectCard = useSelectCard();
  const cards = selectors.currentSelectableCards();
  const selectedIndex = selectors.currentUserSelectedCardIndex();

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

const GameProgressionButton = (status: InGameStatus, mode: UserMode, context: InGameAction) => {
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

const convertHands = (hands: UserHandViewModel[], currentStatus: InGameStatus) =>
  hands.map((v) => ({
    ...v,
    storyPoint: v.card ? asStoryPoint(v.card)?.value ?? null : null,
    showedDown: currentStatus === "ShowedDown",
  }));

export const GameContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const inGameActions = React.useContext(inGameActionContext);
  const inGameSelector = React.useContext(inGameSelectorContext);
  const component = createCardHolderComponent(inGameActions, inGameSelector);
  const currentGameName = inGameSelector.currentGameName();
  const upperLine = inGameSelector.upperLineUserHands();
  const lowerLine = inGameSelector.lowerLineUserHands();
  const currentStatus = inGameSelector.currentGameStatus();
  const showDownResult = inGameSelector.showDownResult();
  const currentUser = signInSelectors.useCurrentUser();
  const changeName = React.useContext(userActionsContext).useChangeUserName();
  const changeMode = inGameActions.useChangeMode();
  const currentUserMode = inGameSelector.currentUserMode() ?? UserMode.normal;
  const signature = inGameSelector.invitationSignature();
  const openGame = inGameActions.useOpenGame();
  const leaveGame = inGameActions.useLeaveGame();
  const history = useHistory();

  React.useEffect(() => {
    openGame(param.gameId as GameId, () => {
      history.replace("/");
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

  return (
    <div className="app__game">
      <GameHeaderComponent
        gameName={currentGameName}
        userName={currentUser.name}
        userMode={currentUserMode}
        onChangeName={(name) => changeName(name)}
        onChangeMode={(mode) => changeMode(mode)}
        onLeaveGame={() => {
          leaveGame();
          history.replace("/");
        }}
        origin={document.location.origin}
        invitationSignature={signature || ""}
      />
      <main className="app__game__main">
        <div className="app__game__main__game-area">
          <div className="app__game__main__grid-container">
            <div className="app__game__main__upper-spacer"></div>
            <PlayerHandsComponent position="upper" userHands={convertHands(upperLine, currentStatus)} />
            <div className="app__game__main__table">
              {GameProgressionButton(currentStatus, currentUserMode, inGameActions)}
            </div>
            <PlayerHandsComponent position="lower" userHands={convertHands(lowerLine, currentStatus)} />
            <div className="app__game__main__lower-spacer"></div>
          </div>
        </div>
      </main>
      {Component}
    </div>
  );
};
