import { gameCreationActionContext } from "@/contexts/actions";
import * as React from "react";
import { useHistory } from "react-router";

interface Props {}

export const GameCreatorContainer: React.FunctionComponent<Props> = () => {
  const context = React.useContext(gameCreationActionContext);
  const setName = context.useSetName();
  const setCards = context.useSetCards();
  const createGame = context.useCreateGame();
  const history = useHistory();

  return (
    <div className="app__game-creator">
      <header className="app__game-creator__header">Create game</header>
      <main className="app__game-creator__main">
        <div className="app__game-creator__main__input-container">
          <span className="app__game-creator__main__input-row">
            <label className="app__game-creator__main__input-label">Name</label>
            <input type="text" className="app__game-creator__main__name" onChange={(e) => setName(e.target.value)} />
          </span>
          <span className="app__game-creator__main__input-row">
            <label className="app__game-creator__main__input-label">Cards</label>
            <input type="text" className="app__game-creator__main__card" onChange={(e) => setCards(e.target.value)} />
          </span>
        </div>
      </main>
      <footer className="app__game-creator__footer">
        <button
          className="app__game-creator__submit"
          onClick={() => createGame((gameId) => history.replace(`/game/${gameId}`))}
        >
          Submit
        </button>
      </footer>
    </div>
  );
};
