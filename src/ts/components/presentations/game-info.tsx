import { Component } from "solid-js";

interface Props {
  gameName: string;
  onLeaveGame: () => void;
}

export const GameInfo: Component<Props> = (props) => {
  return (
    <main class="app__game__header__game-info">
      <div class="app__game__header__game-info__name-container">
        <span class="app__game__header__game-info__name-label">Now voting</span>
        <span class="app__game__header__game-info__name"> {props.gameName}</span>
      </div>
      <div class="app__game__header__game-info__actions">
        <button class="app__game__header__game-info__actions__leave" onClick={() => props.onLeaveGame()}></button>
      </div>
    </main>
  );
};
