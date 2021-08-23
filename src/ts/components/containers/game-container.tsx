import { inGameSelectors } from "@/status/in-game";
import * as React from "react";
import { useParams } from "react-router";
import { CardHolderComponent } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";

interface Props {}

const createCardHolderComponent = () => {
  const cards = inGameSelectors.currentSelectableCards();
  const selectedIndex = inGameSelectors.currentUserSelectedCard();

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

  return <CardHolderComponent displays={props.displays} selectedIndex={props.selectedIndex} onClickCard={() => {}} />;
};

export const GameContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ gameId: string }>();

  return (
    <div className="app__game">
      <GameHeaderComponent />
      <main className="app__game__main"></main>
      <footer className="app__game__footer">{createCardHolderComponent()}</footer>
    </div>
  );
};
