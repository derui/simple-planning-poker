import React from "react";

interface Props {
  gameName: string;
}

export const GameInfoComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <main className="app__game__header__game-info">
      <div className="app__game__header__game-info__name-container">
        <span className="app__game__header__game-info__name-label">Now voting</span>
        <span className="app__game__header__game-info__name"> {props.gameName}</span>
      </div>
      <div className="app__game__header__game-info__actions">
        <button className="app__game__header__game-info__actions__leave"></button>
      </div>
    </main>
  );
};
