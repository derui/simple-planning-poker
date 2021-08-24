import * as React from "react";
import { inGameActionContext } from "@/contexts/actions";
import { InGameAction } from "@/status/in-game";
import { CardHolderComponent } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";
import { PlayerHandsComponent } from "../presentations/player-hands";

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

export const GameContainer: React.FunctionComponent<Props> = () => {
  const inGameActions = React.useContext(inGameActionContext);
  const component = createCardHolderComponent(inGameActions);
  const currentGameName = inGameActions.selectors.currentGameName();
  const upperLine = inGameActions.selectors.upperLineUserHands();
  const lowerLine = inGameActions.selectors.lowerLineUserHands();
  const joinUser = inGameActions.useJoinUser();

  React.useEffect(() => {
    joinUser();
  });

  return (
    <div className="app__game">
      <GameHeaderComponent gameName={currentGameName} />
      <main className="app__game__main">
        <div className="app__game__main__game-area">
          <div className="app__game__main__grid-container">
            <div className="app__game__main__upper-spacer"></div>
            <PlayerHandsComponent position="upper" userHands={upperLine} />
            <div className="app__game__main__table"></div>
            <PlayerHandsComponent position="lower" userHands={lowerLine} />
            <div className="app__game__main__lower-spacer"></div>
          </div>
        </div>
      </main>
      {component}
    </div>
  );
};
