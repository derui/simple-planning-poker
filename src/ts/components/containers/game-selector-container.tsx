import { signInSelectors } from "@/status/signin";
import * as React from "react";
import { Link } from "react-router-dom";

interface Props {}

const EmptyComponent = () => {
  return (
    <div className="app__game-selector__empty">
      <span className="app__game-selector__empty__text">You do not have games that you are invited before.</span>
    </div>
  );
};

export const GameSelectorContainerComponent: React.FunctionComponent<Props> = () => {
  const games = signInSelectors.useJoinedGames();

  const gameComponents = games.map((v) => {
    return (
      <Link key={v.id} className="app__game-selector__main__selection-container" to={`/game/${v.id}`}>
        <span className="app__game-selector__main__game-selector">{v.name}</span>
      </Link>
    );
  });

  return (
    <div className="app__game-selector">
      <header className="app__game-selector__header">Select game you already joined</header>
      <main className="app__game-selector__main">{games.length > 0 ? gameComponents : <EmptyComponent />}</main>
      <footer className="app__game-selector__footer">
        <Link className="app__game-selector__creator-opener" to="/game/create">
          Create Game
        </Link>
      </footer>
    </div>
  );
};
