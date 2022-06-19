import { gameActionsContext } from "@/contexts/actions/game-actions";
import { useNavigate } from "solid-app-router";
import { Component, createSignal, useContext } from "solid-js";

const DEFAULT_CARDS = "0,1,2,3,5,8,13,21,34,55,89";

export const GameCreatorContainer: Component = () => {
  const context = useContext(gameActionsContext);
  const createGame = context.useCreateGame();
  const navigate = useNavigate();
  const [name, setName] = createSignal("");
  const [cards, setCards] = createSignal(DEFAULT_CARDS);
  const callbackToCreateGame = () =>
    createGame({
      name: name(),
      cards: cards()
        .split(",")
        .map((v) => Number(v.trim())),
      callback: (gameId) => navigate(`/game/play/${gameId}`, { replace: true }),
    });

  return (
    <div class="app__game-creator">
      <header class="app__game-creator__header">Create game</header>
      <main class="app__game-creator__main">
        <div class="app__game-creator__main__input-container">
          <span class="app__game-creator__main__input-row">
            <label class="app__game-creator__main__input-label">Name</label>
            <input
              type="text"
              class="app__game-creator__main__name"
              value={name()}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </span>
          <span class="app__game-creator__main__input-row">
            <label class="app__game-creator__main__input-label">Cards</label>
            <input
              type="text"
              class="app__game-creator__main__card"
              value={cards()}
              onChange={(e) => setCards(e.currentTarget.value)}
            />
          </span>
        </div>
      </main>
      <footer class="app__game-creator__footer">
        <button class="app__game-creator__submit" onClick={callbackToCreateGame}>
          Submit
        </button>
      </footer>
    </div>
  );
};
