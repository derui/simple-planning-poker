import * as React from "react";

interface Props {}

export const GameCreatorContainer: React.FunctionComponent<Props> = () => {
  return (
    <div className="app__game-creator">
      <header className="app__game-creator__header">Create game</header>
      <main className="app__game-creator__main">
        <div className="app__game-creator__main__input-container">
          <span className="app__game-creator__main__input-row">
            <label className="app__game-creator__main__input-label">Name</label>
            <input type="text" className="app__game-creator__main__name" />
          </span>
          <span className="app__game-creator__main__input-row">
            <label className="app__game-creator__main__input-label">Cards</label>
            <input type="text" className="app__game-creator__main__card" />
          </span>
        </div>
      </main>
      <footer className="app__game-creator__footer">
        <button className="app__game-creator__submit">Submit</button>
      </footer>
    </div>
  );
};
