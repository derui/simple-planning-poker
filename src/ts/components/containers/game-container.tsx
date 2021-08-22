import { inGameSelectors } from "@/status/in-game";
import * as React from "react";
import { useParams } from "react-router";
import { CardHolderComponent } from "../presentations/card-holder";

interface Props {}

const createCardHolderComponent = () => {
  const cards = inGameSelectors.currentSelectableCards()
  const selectedIndex = inGameSelectors.currentUserSelectedCard()

  const props = {
    displays: cards.map(v => {
      switch (v.kind) {
        case 'giveup':
          return '?'
        case 'storypoint':
          return v.storyPoint.value.toString()
      }
    }),
    selectedIndex: selectedIndex ?? null
  }

  return <CardHolderComponent displays={props.displays} selectedIndex={props.selectedIndex} />
}

export const GameContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ gameId:string }>()

  return (
    <div className="app__game">
      <header className="app__game__header"></header>
      <main className="app__game__main">
      </main>
      <footer className="app__game__footer">
      {createCardHolderComponent()}
      </footer>
    </div>
  );
};
