import * as React from "react";
import { inGameActionContext, userActionsContext } from "@/contexts/actions";
import { InGameAction, InGameStatus, ShowDownResult } from "@/status/in-game";
import { CardHolderComponent } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";
import { PlayerHandsComponent } from "../presentations/player-hands";
import { AveragePointShowcaseComponent } from "../presentations/average-point-showcase";
import { UserInfoComponent } from "../presentations/user-info";
import { signInSelectors } from "@/status/signin";

interface Props {}

const createCardHolderComponent = ({ useSelectCard, selectors }: InGameAction) => {
  const selectCard = useSelectCard();
  const cards = selectors.currentSelectableCards();
  const selectedIndex = selectors.currentUserSelectedCard();

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

const createAveragePointShowcase = (showDownResult: ShowDownResult) => {
  const average = showDownResult.average.toFixed(1).toString();
  return <AveragePointShowcaseComponent averagePoint={average} cardCounts={showDownResult.cardCounts} />;
};

const GameProgressionButton = (status: InGameStatus, context: InGameAction) => {
  const showDown = context.useShowDown();
  const newGame = context.useNewGame();

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

export const GameContainer: React.FunctionComponent<Props> = () => {
  const inGameActions = React.useContext(inGameActionContext);
  const component = createCardHolderComponent(inGameActions);
  const currentGameName = inGameActions.selectors.currentGameName();
  const upperLine = inGameActions.selectors.upperLineUserHands();
  const lowerLine = inGameActions.selectors.lowerLineUserHands();
  const joinUser = inGameActions.useJoinUser();
  const currentStatus = inGameActions.selectors.currentGameStatus();
  const showDownResult = inGameActions.selectors.showDownResult();
  const currentUser = signInSelectors.useCurrentUser();
  const changeName = React.useContext(userActionsContext).useChangeUserName();

  React.useEffect(() => {
    joinUser();
  });

  return (
    <div className="app__game">
      <GameHeaderComponent gameName={currentGameName} />
      <main className="app__game__main">
        <div className="app__game__main__game-area">
          <UserInfoComponent name={currentUser.name} onChangeName={(name) => changeName(name)} />
          <div className="app__game__main__grid-container">
            <div className="app__game__main__upper-spacer"></div>
            <PlayerHandsComponent position="upper" userHands={upperLine} />
            <div className="app__game__main__table">{GameProgressionButton(currentStatus, inGameActions)}</div>
            <PlayerHandsComponent position="lower" userHands={lowerLine} />
            <div className="app__game__main__lower-spacer"></div>
          </div>
        </div>
      </main>
      {currentStatus === "ShowedDown" ? createAveragePointShowcase(showDownResult) : component}
    </div>
  );
};
