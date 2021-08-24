import * as React from "react";
import { inGameActionContext } from "@/contexts/actions";
import { InGameAction } from "@/status/in-game";
import { CardHolderComponent } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";

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

  return (
    <div className="app__game">
      <GameHeaderComponent />
      <main className="app__game__main"></main>
      {component}
    </div>
  );
};
