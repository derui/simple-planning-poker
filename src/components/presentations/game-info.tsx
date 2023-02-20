import React from "react";

interface Props {
  gameName: string;
  onLeaveGame: () => void;
}

export const GameInfoComponent: React.FunctionComponent<Props> = ({ gameName, onLeaveGame }) => {
  return (
    <main className="app__game__header__game-info">
      <div className="app__game__header__game-info__name-container">
        <span className="app__game__header__game-info__name-label">Now voting</span>
        <span className="app__game__header__game-info__name"> {gameName}</span>
      </div>
      <div className="app__game__header__game-info__actions">
        <button className="app__game__header__game-info__actions__leave" onClick={() => onLeaveGame()}></button>
      </div>
    </main>
  );
};
