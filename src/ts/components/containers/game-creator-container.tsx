import gameActionsContext from "@/contexts/actions/game-actions";
import * as React from "react";
import { useNavigate } from "react-router";

interface Props {}

const DEFAULT_CARDS = "0,1,2,3,5,8,13,21,34,55,89";

export const GameCreatorContainer: React.FunctionComponent<Props> = () => {
  const context = React.useContext(gameActionsContext);
  const createGame = context.useCreateGame();
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [cards, setCards] = React.useState(DEFAULT_CARDS);
  const callbackToCreateGame = () =>
    createGame({
      name,
      cards: cards.split(",").map((v) => Number(v.trim())),
      callback: (gameId) => navigate(`/game/${gameId}`, { replace: true }),
    });

  return (
    <div className="app__game-creator">
      <header className="app__game-creator__header">Create game</header>
      <main className="app__game-creator__main">
        <div className="app__game-creator__main__input-container">
          <span className="app__game-creator__main__input-row">
            <label className="app__game-creator__main__input-label">Name</label>
            <input
              type="text"
              className="app__game-creator__main__name"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </span>
          <span className="app__game-creator__main__input-row">
            <label className="app__game-creator__main__input-label">Cards</label>
            <input
              type="text"
              className="app__game-creator__main__card"
              defaultValue={cards}
              onChange={(e) => setCards(e.target.value)}
            />
          </span>
        </div>
      </main>
      <footer className="app__game-creator__footer">
        <button className="app__game-creator__submit" onClick={callbackToCreateGame}>
          Submit
        </button>
      </footer>
    </div>
  );
};
